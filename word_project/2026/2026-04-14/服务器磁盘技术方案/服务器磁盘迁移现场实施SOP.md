# 服务器磁盘迁移现场实施SOP

## 1. 目标

本SOP仅服务于现场实施，不讲汇报口径，只讲执行顺序、停点、检查点、回退点。

适用范围：
- 三方、安全平台：`192.168.0.111`
- 门户、CAS单点登录、泛微：`192.168.0.3`
- 对外平台：`192.168.0.4`

适用内容：
- 共享盘分区与挂载
- MySQL 数据目录迁移
- 宿主机业务日志迁移
- 系统日志迁移
- 回滚处理

不适用内容：
- Docker 容器日志迁移
- `/opt` 程序安装目录迁移
- 业务代码改造
- 应用配置重构

---

## 2. 实施总原则

1. 一次只动一台服务器。
2. 一次只切一个核心服务。
3. 先做共享盘可用性，再做 MySQL，再做日志。
4. 日志必须“先发现、再审核、后迁移”。
5. 每完成一步，立即做验证；验证不通过，立即回滚，不进入下一步。
6. 本地 `.bak_时间戳` 目录在验收通过前禁止删除。

---

## 3. 现场角色分工建议

### 3.1 执行人
负责实际执行脚本与命令。

### 3.2 业务确认人
负责确认：
- MySQL 是否可连
- 页面是否可访问
- 关键业务是否可用
- 日志是否持续写入

### 3.3 记录人
负责记录：
- 开始时间
- 停止时间
- 恢复时间
- 验证结果
- 回滚点
- 异常现象

---

## 4. 总体执行顺序

### 阶段A：共享盘基础准备
1. 在对外平台 `192.168.0.4` 上执行共享盘重分区与 node3 初始化。
2. 在三方、安全平台 `192.168.0.111` 上挂载 node1 分区并初始化目录。
3. 在门户/CAS/泛微 `192.168.0.3` 上挂载 node2 分区并初始化目录。

### 阶段B：MySQL 迁移
1. 三方、安全平台 MySQL
2. 门户/CAS/泛微 MySQL 3308
3. 门户/CAS/泛微 MySQL 3306
4. 对外平台 MySQL

### 阶段C：日志迁移
1. 各节点运行日志发现脚本
2. 审核日志候选清单
3. 分批执行日志迁移
4. 每批迁移后立即验证

---

## 5. 阶段A：共享盘基础准备SOP

## 5.1 在 192.168.0.4 执行共享盘重分区

### 步骤1：确认旧 `/filedata` 无正式生产数据
执行前确认：
- `/filedata` 只存在少量测试/空目录
- 无业务服务正在直接读写旧 `/filedata`

建议命令：
```bash
mount | grep filedata
find /filedata -maxdepth 2 -type f | head
lsof +D /filedata | head
```

### 步骤2：执行 node3 共享盘初始化脚本
脚本：
- [node3_01_init_shared_disk.sh](scripts/node3_01_init_shared_disk.sh)

执行：
```bash
bash node3_01_init_shared_disk.sh
```

### 步骤3：确认结果
检查项：
```bash
lsblk
blkid /dev/sdb1 /dev/sdb2 /dev/sdb3
df -h | grep filedata
find /filedata/node3 -maxdepth 3 -type d | sort
cat /tmp/node1.fstab.sample
cat /tmp/node2.fstab.sample
cat /tmp/node3.fstab.sample
```

通过标准：
- `/dev/sdb1 /dev/sdb2 /dev/sdb3` 均存在
- `FILEDATA_NODE1/2/3` label 正确
- `/filedata/node3` 已成功挂载
- `mysql/logs/meta` 目录已创建

回退点：
- 若此阶段失败，停止后续所有动作，不进入 MySQL 迁移阶段。

---

## 5.2 在 192.168.0.111 挂载 node1 分区

脚本：
- [node1_01_init_shared_disk.sh](scripts/node1_01_init_shared_disk.sh)

执行：
```bash
bash node1_01_init_shared_disk.sh
```

检查：
```bash
df -h | grep /filedata/node1
find /filedata/node1 -maxdepth 3 -type d | sort
cat /tmp/node1.fstab.sample
```

通过标准：
- `/filedata/node1` 正常挂载
- `mysql/logs/meta` 目录齐全

---

## 5.3 在 192.168.0.3 挂载 node2 分区

脚本：
- [node2_01_init_shared_disk.sh](scripts/node2_01_init_shared_disk.sh)

执行：
```bash
bash node2_01_init_shared_disk.sh
```

检查：
```bash
df -h | grep /filedata/node2
find /filedata/node2 -maxdepth 3 -type d | sort
cat /tmp/node2.fstab.sample
```

通过标准：
- `/filedata/node2` 正常挂载
- `mysql/logs/meta` 目录齐全

---

## 6. 阶段B：MySQL迁移SOP

## 6.1 三方、安全平台（192.168.0.111）

### 原路径
- datadir：`/data/mysql57/data`
- 目标：`/filedata/node1/mysql/mysql57_3603`

### 执行步骤
1. 通知业务进入短暂停写窗口。
2. 执行脚本：
   - [node1_02_migrate_mysql.sh](scripts/node1_02_migrate_mysql.sh)
3. 验证进程与端口。
4. 验证业务连接。

执行：
```bash
bash node1_02_migrate_mysql.sh
```

验证：
```bash
ps -ef | grep mysqld
ss -lntp | grep 3603
mount | grep "/data/mysql57/data"
df -h /data/mysql57/data
ls -ld /data/mysql57/data /filedata/node1/mysql/mysql57_3603
```

业务验证：
- 能连接数据库
- 业务读操作正常
- 业务写操作正常

失败回退：
- [node1_99_rollback_all.sh](scripts/node1_99_rollback_all.sh)

---

## 6.2 门户、CAS单点登录、泛微（192.168.0.3）

### 先迁 3308，后迁 3306
绝对禁止两套实例同时切换。

### 实例1：3308
- datadir：`/opt/mysql/mydata/3308/data`
- 目标：`/filedata/node2/mysql/mysql3308`

### 实例2：3306
- datadir：`/usr/local/weaver_mysql/data`
- 目标：`/filedata/node2/mysql/weaver3306`

### 执行步骤
1. 先通知 3308 关联业务停写。
2. 执行：
   - [node2_02_migrate_mysql.sh](scripts/node2_02_migrate_mysql.sh)
3. 先核验 3308，再核验 3306。
4. 任一实例异常，不继续后续日志迁移。

验证命令：
```bash
ps -ef | grep mysqld
ss -lntp | egrep '3306|3308'
mount | egrep '/opt/mysql/mydata/3308/data|/usr/local/weaver_mysql/data'
df -h /opt/mysql/mydata/3308/data
df -h /usr/local/weaver_mysql/data
```

业务验证：
- 门户登录正常
- CAS 跳转正常
- 泛微页面正常
- 数据写入正常

失败回退：
- [node2_99_rollback_all.sh](scripts/node2_99_rollback_all.sh)

---

## 6.3 对外平台（192.168.0.4）

### 原路径
- datadir：`/data/mysql57/data`
- 目标：`/filedata/node3/mysql/mysql57_3603`

### 执行步骤
1. 通知业务进入短暂停写窗口。
2. 执行脚本：
   - [node3_02_migrate_mysql.sh](scripts/node3_02_migrate_mysql.sh)
3. 验证进程、端口、挂载、读写。

执行：
```bash
bash node3_02_migrate_mysql.sh
```

验证：
```bash
ps -ef | grep mysqld
ss -lntp | grep 3603
mount | grep "/data/mysql57/data"
df -h /data/mysql57/data
```

失败回退：
- [node3_99_rollback_all.sh](scripts/node3_99_rollback_all.sh)

---

## 7. 阶段C：日志迁移SOP

## 7.1 先发现，不直接迁移

执行脚本：
- [node1_03_discover_logs.sh](scripts/node1_03_discover_logs.sh)
- [node2_03_discover_logs.sh](scripts/node2_03_discover_logs.sh)
- [node3_03_discover_logs.sh](scripts/node3_03_discover_logs.sh)

执行：
```bash
bash nodeX_03_discover_logs.sh
```

生成文件：
- `/filedata/nodeX/meta/manifests/discovered_logs.tsv`

### 审核规则
审核时重点看：
1. `path` 是否真的是日志目录/日志文件
2. `description` 是否符合实际用途
3. `service` 是否归属正确
4. `target_subdir` 是否合理
5. `method` 是否合理
6. 是否与父路径/子路径重复
7. node2 是否误包含 Docker 路径

### 审核输出
把 `discovered_logs.tsv` 复制一份为：
- `approved_logs.tsv`

只把确认要迁移的行改成：
- `approved=Y`

其余保留 `N`

---

## 7.2 执行日志迁移

执行脚本：
- [node1_04_apply_logs_migration.sh](scripts/node1_04_apply_logs_migration.sh)
- [node2_04_apply_logs_migration.sh](scripts/node2_04_apply_logs_migration.sh)
- [node3_04_apply_logs_migration.sh](scripts/node3_04_apply_logs_migration.sh)

执行：
```bash
bash nodeX_04_apply_logs_migration.sh
```

### 执行后检查
```bash
mount | grep /var/log
find /filedata/nodeX/logs -maxdepth 3 -type d | sort
cat /filedata/nodeX/meta/manifests/migration_state.tsv
```

### 业务验证
- 服务仍在写日志
- 新日志文件生成在共享盘对应目录
- 原路径仍可访问
- 监控/采集程序未报错

---

## 8. 回滚SOP

## 8.1 回滚触发条件
满足任一即回滚：
- MySQL 启动失败
- 页面不可用
- 登录失败
- 数据写入异常
- 日志不再产生
- 挂载关系错误
- 权限异常

## 8.2 回滚脚本
- [node1_99_rollback_all.sh](scripts/node1_99_rollback_all.sh)
- [node2_99_rollback_all.sh](scripts/node2_99_rollback_all.sh)
- [node3_99_rollback_all.sh](scripts/node3_99_rollback_all.sh)

执行：
```bash
bash nodeX_99_rollback_all.sh
```

回滚后验证：
```bash
mount | grep -E '/data/mysql57/data|/opt/mysql/mydata/3308/data|/usr/local/weaver_mysql/data|/var/log'
ps -ef | grep mysqld
ss -lntp | egrep '3306|3308|3603'
```

---

## 9. 现场禁止事项

1. 禁止三台服务器同时直挂同一个 ext4 文件系统读写。
2. 禁止在未审核 `approved_logs.tsv` 的情况下直接执行日志迁移。
3. 禁止 Node2 在日志迁移中纳入 Docker 日志。
4. 禁止在 MySQL 未验证成功前删除本地 `.bak_` 目录。
5. 禁止双 MySQL 实例同时切换。
6. 禁止一边切换一边修改业务配置。

---

## 10. 最小现场执行顺序总结

### 第一步
在 `192.168.0.4`：
```bash
bash node3_01_init_shared_disk.sh
```

### 第二步
在 `192.168.0.111`：
```bash
bash node1_01_init_shared_disk.sh
```

### 第三步
在 `192.168.0.3`：
```bash
bash node2_01_init_shared_disk.sh
```

### 第四步
依次迁移 MySQL：
```bash
bash node1_02_migrate_mysql.sh
bash node2_02_migrate_mysql.sh
bash node3_02_migrate_mysql.sh
```

### 第五步
各节点先发现日志：
```bash
bash nodeX_03_discover_logs.sh
```

### 第六步
人工审核 `approved_logs.tsv`

### 第七步
执行日志迁移：
```bash
bash nodeX_04_apply_logs_migration.sh
```

### 第八步
有异常立即执行：
```bash
bash nodeX_99_rollback_all.sh
```
