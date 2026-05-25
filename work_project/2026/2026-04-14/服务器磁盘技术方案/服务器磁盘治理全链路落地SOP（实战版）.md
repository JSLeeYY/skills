# 服务器磁盘治理全链路落地SOP（实战版）

## 1. 文档定位

目标只有一个：把三套业务系统的 MySQL 数据、宿主机业务日志、系统日志从系统盘迁到共享盘，并做到：

- 有窗口
- 有步骤
- 有停点
- 有验证
- 有回滚
- 有观察期
- 有最终收口

适用对象：

- 执行人
- 现场指挥人
- 业务确认人
- 记录人

适用范围：

- 三方、安全平台：`192.168.0.111`
- 门户、CAS 单点登录、泛微：`192.168.0.3`
- 对外平台：`192.168.0.4`

不在本次范围内：

- Docker 容器日志迁移
- `/opt` 程序安装目录迁移
- 业务代码改造
- 应用配置重构

## 2. 执行步骤

全链路建议按 7 个阶段推进：

1. 变更立项和窗口审批
2. 实施前准备和脚本预检
3. 共享盘重分区和各节点挂载初始化
4. MySQL 切换
5. 日志发现、审核、迁移
6. 验收和观察期
7. 观察期后清理

## 3. 实施总原则

1. 一次只动一台服务器。
2. 一次只切一个核心服务。
3. 先做共享盘基础，再做 MySQL，再做日志。
4. 所有业务切换必须在明确窗口内完成。
5. 每一步必须有通过标准，不通过立即停，不进入下一步。
6. 所有原路径必须保留 `.bak_时间戳` 备份，观察期结束前不得删除。
7. 日志不允许盲迁，必须“先发现、后审核、再迁移”。

## 4. 角色分工

建议至少 4 个角色同时在场：

### 4.1 现场指挥人

负责：

- 宣布开始/暂停/回滚
- 判断是否放行到下一步
- 管控窗口时间

### 4.2 执行人

负责：

- 登录服务器执行脚本和命令
- 保存执行输出
- 按步骤操作，不擅自跳步

### 4.3 业务确认人

负责：

- 页面访问验证
- 登录验证
- 数据读写验证
- 关键交易或关键功能验证

### 4.4 记录人

负责：

- 记录每一步开始时间、结束时间
- 记录每个停点的验证结果
- 记录异常现象、回滚点、恢复时间

## 5. 上线前必须满足的准入条件

### 5.1 业务和管理侧

- 已拿到正式变更窗口
- 已明确业务停写或短暂停服方式
- 已明确业务验证人和联系电话
- 已明确回滚授权人
- 已明确验收口径

### 5.2 服务器和账号侧

- 三台服务器 root 权限可用
- 三台服务器之间和共享盘挂载链路可用
- 已确认共享盘设备为 `/dev/sdb`
- 已确认 Node3 当前旧 `/filedata` 中没有正式生产数据

### 5.3 脚本和文件侧

生产前建议把脚本统一放在同一目录，例如：

```bash
/root/disk-migration/20260415/scripts
```

每台服务器都应具备以下文件：

- [node1_01_init_shared_disk.sh](scripts/node1_01_init_shared_disk.sh)
- [node1_02_migrate_mysql.sh](scripts/node1_02_migrate_mysql.sh)
- [node1_03_discover_logs.sh](scripts/node1_03_discover_logs.sh)
- [node1_04_apply_logs_migration.sh](scripts/node1_04_apply_logs_migration.sh)
- [node1_99_rollback_all.sh](scripts/node1_99_rollback_all.sh)
- [node2_01_init_shared_disk.sh](scripts/node2_01_init_shared_disk.sh)
- [node2_02_migrate_mysql.sh](scripts/node2_02_migrate_mysql.sh)
- [node2_03_discover_logs.sh](scripts/node2_03_discover_logs.sh)
- [node2_04_apply_logs_migration.sh](scripts/node2_04_apply_logs_migration.sh)
- [node2_99_rollback_all.sh](scripts/node2_99_rollback_all.sh)
- [node3_01_init_shared_disk.sh](scripts/node3_01_init_shared_disk.sh)
- [node3_02_migrate_mysql.sh](scripts/node3_02_migrate_mysql.sh)
- [node3_03_discover_logs.sh](scripts/node3_03_discover_logs.sh)
- [node3_04_apply_logs_migration.sh](scripts/node3_04_apply_logs_migration.sh)
- [node3_99_rollback_all.sh](scripts/node3_99_rollback_all.sh)
- [selfcheck.sh](scripts/selfcheck.sh)

### 5.4 依赖命令侧

至少要提前确认以下命令在对应节点可用：

**Node3 分区阶段**

- `parted`
- `mkfs.ext4`
- `blkid`
- `mount`
- `umount`

**各节点挂载/迁移阶段**

- `bash`
- `rsync`
- `mount`
- `ss`
- `pgrep`
- `find`
- `awk`
- `stat`
- `tac`

**现场排障常用**

- `lsof`
- `df`
- `lsblk`
- `ps`
- `tail`

### 5.5 必须注意的两个现实问题

#### 问题1：当前 `node2_02_migrate_mysql.sh` 会一次连续迁移两个实例

现有脚本不是“只迁 3308”或“只迁 3306”，而是一次执行顺序迁移：

1. `3308`
2. `3306`

这意味着：

- 如果你坚持“3308 验证通过后再放行 3306”，那么正式生产前应先把该脚本拆成两个独立入口，或增加实例选择参数。
- 如果你不改脚本，就要接受 Node2 在一个执行过程中连续切换两个实例，中间只能做脚本内的进程/端口校验，无法插入完整业务放行。

生产建议：先处理这个问题，再上窗口。

#### 问题2：当前 `--dry-run` 不是完全只读

现有 MySQL 和日志迁移脚本的 `--dry-run` 只是不执行核心破坏性命令，但仍可能：

- 创建目标目录
- 创建运行日志
- 创建 `migration_state.tsv` 表头

因此：

- `--dry-run` 可以作为“轻量预演”
- 不能当作“绝对零变更预演”

## 6. 时间线建议

### T-7 至 T-3：准备阶段

完成以下事项：

1. 明确变更范围和不变更范围
2. 明确业务验证点
3. 确认共享盘 `/dev/sdb`
4. 确认旧 `/filedata` 是否有有效数据
5. 准备脚本目录并上传到各节点
6. 确认命令依赖齐全
7. 确认业务联系人、回滚联系人、群组或电话会议桥

### T-1：预检阶段

每台服务器都做一次预检：

1. 备份 `/etc/fstab`
2. 收集实施前基线
3. 做脚本语法检查
4. 检查共享盘、进程、端口、目录现状
5. 确认业务验证人在线可联络

推荐执行：

```bash
cp -a /etc/fstab /etc/fstab.bak_$(date +%Y%m%d%H%M%S)
bash selfcheck.sh
```

### T0：正式窗口

窗口内按以下顺序执行：

1. Node3 重分区
2. Node1 挂载初始化
3. Node2 挂载初始化
4. Node1 MySQL
5. Node2 MySQL
6. Node3 MySQL
7. 日志发现
8. 审核 approved 清单
9. 日志迁移
10. 验收

### T+1 至 T+N：观察期

至少覆盖 1 个业务高峰周期。建议在观察期内保留所有 `.bak_时间戳` 目录和全部迁移记录。

## 7. 实施前基线采集

正式执行前，建议每台服务器建立一个记录目录，例如：

```bash
mkdir -p /root/disk-migration/records/$(date +%Y%m%d_%H%M%S)
```

至少采集以下基线：

```bash
hostname
date
df -hT
lsblk
blkid
mount | egrep 'filedata|mysql|weaver'
ps -ef | grep mysqld
ss -lntp | egrep '3306|3308|3603'
```

需要额外确认的关键信息：

- Node3 上 `/filedata` 是否仍被占用
- 三台服务器当前 MySQL datadir 是否与方案一致
- 当前 `/etc/fstab` 中是否已有旧的 `filedata` 或 bind mount 项

## 8. 正式实施SOP

## 8.1 阶段A：Node3 共享盘重分区

### A-1. 执行前停点

必须全部满足后才能继续：

- 已确认旧 `/filedata` 无正式生产数据
- 已确认 Node1/Node2 没有挂载该共享盘
- 已确认业务方知晓这是高风险步骤

推荐检查：

```bash
mount | grep filedata
find /filedata -maxdepth 2 -type f | head
lsof +D /filedata | head
```

### A-2. 执行

执行脚本：

```bash
bash node3_01_init_shared_disk.sh
```

### A-3. 执行后验证

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

- `/dev/sdb1`、`/dev/sdb2`、`/dev/sdb3` 已创建
- 三个分区 label 正确
- `/filedata/node3` 已挂载
- `mysql/logs/meta` 目录存在

### A-4. 必做补充动作

`node3_01_init_shared_disk.sh` 会生成 `/tmp/node3.fstab.sample`，但不会自动写入 `/etc/fstab`。

因此必须手工完成：

1. 将 `/tmp/node3.fstab.sample` 合并到 `/etc/fstab`
2. 执行 `mount -a`
3. 再次确认挂载无报错

若这里不做，服务器重启后基础挂载可能丢失。

## 8.2 阶段B：Node1 挂载初始化

### B-1. 执行

```bash
bash node1_01_init_shared_disk.sh
```

### B-2. 验证

```bash
df -h | grep /filedata/node1
find /filedata/node1 -maxdepth 3 -type d | sort
cat /tmp/node1.fstab.sample
```

通过标准：

- `/filedata/node1` 已挂载成功
- `mysql/logs/meta` 目录齐全

### B-3. 必做补充动作

将 `/tmp/node1.fstab.sample` 合并到 `/etc/fstab`，然后执行：

```bash
mount -a
```

再复核：

```bash
mount | grep /filedata/node1
```

## 8.3 阶段C：Node2 挂载初始化

### C-1. 执行

```bash
bash node2_01_init_shared_disk.sh
```

### C-2. 验证

```bash
df -h | grep /filedata/node2
find /filedata/node2 -maxdepth 3 -type d | sort
cat /tmp/node2.fstab.sample
```

通过标准：

- `/filedata/node2` 已挂载成功
- `mysql/logs/meta` 目录齐全

### C-3. 必做补充动作

将 `/tmp/node2.fstab.sample` 合并到 `/etc/fstab`，然后执行：

```bash
mount -a
```

再复核：

```bash
mount | grep /filedata/node2
```

## 8.4 阶段D：MySQL 迁移

MySQL 是本次实施的核心风险段。必须严格执行“停写通知 -> 切换 -> 进程验证 -> 业务验证 -> 放行下一步”。

### D-1. Node1 MySQL

执行前确认：

- 业务方已确认短暂停写
- 目标目录 `/filedata/node1/mysql/mysql57_3603` 存在
- `/data/mysql57/data` 当前为本地目录，未被错误挂载

轻量预演：

```bash
bash node1_02_migrate_mysql.sh --dry-run
```

正式执行：

```bash
bash node1_02_migrate_mysql.sh
```

执行后验证：

```bash
ps -ef | grep mysqld
ss -lntp | grep 3603
mount | grep "/data/mysql57/data"
df -h /data/mysql57/data
ls -ld /data/mysql57/data /filedata/node1/mysql/mysql57_3603
```

业务放行标准：

- 数据库可连接
- 业务读操作正常
- 业务写操作正常
- 原路径已变为 bind mount

失败回滚：

```bash
bash node1_99_rollback_all.sh mysql
```

### D-2. Node2 MySQL

这里分两种执行模式。

**模式A：推荐模式**

正式生产前，先把 [node2_02_migrate_mysql.sh](scripts/node2_02_migrate_mysql.sh) 拆成 3308 和 3306 两个独立执行入口，再按：

1. 迁 3308
2. 完整业务验证
3. 放行 3306

**模式B：兼容模式**

如果沿用现有脚本，则接受它一次连续迁移两个实例：

```bash
bash node2_02_migrate_mysql.sh --dry-run
bash node2_02_migrate_mysql.sh
```

执行后验证：

```bash
ps -ef | grep mysqld
ss -lntp | egrep '3306|3308'
mount | egrep '/opt/mysql/mydata/3308/data|/usr/local/weaver_mysql/data'
df -h /opt/mysql/mydata/3308/data
df -h /usr/local/weaver_mysql/data
```

业务放行标准：

- 门户登录正常
- CAS 跳转正常
- 泛微访问正常
- 3306 和 3308 均可正常读写

失败回滚：

```bash
bash node2_99_rollback_all.sh mysql
```

### D-3. Node3 MySQL

轻量预演：

```bash
bash node3_02_migrate_mysql.sh --dry-run
```

正式执行：

```bash
bash node3_02_migrate_mysql.sh
```

执行后验证：

```bash
ps -ef | grep mysqld
ss -lntp | grep 3603
mount | grep "/data/mysql57/data"
df -h /data/mysql57/data
```

业务放行标准：

- 对外平台功能正常
- 数据库连接正常
- 原路径已 bind 到共享盘

失败回滚：

```bash
bash node3_99_rollback_all.sh mysql
```

## 8.5 阶段E：日志发现与审核

日志迁移不能直接做，必须先发现、再审核、后迁移。

### E-1. 生成候选清单

分别在三台服务器执行：

```bash
bash node1_03_discover_logs.sh
bash node2_03_discover_logs.sh
bash node3_03_discover_logs.sh
```

将生成：

- `/filedata/node1/meta/manifests/discovered_logs.tsv`
- `/filedata/node2/meta/manifests/discovered_logs.tsv`
- `/filedata/node3/meta/manifests/discovered_logs.tsv`

### E-2. 生成人工审核清单

推荐做法：

```bash
cp /filedata/nodeX/meta/manifests/discovered_logs.tsv /filedata/nodeX/meta/manifests/approved_logs.tsv
```

审核时只把明确批准迁移的条目标记为 `Y`，其余保持 `N`。

审核重点：

- 是不是真正的日志路径
- 是否属于本次迁移范围
- 目录类是否用 `bind`
- 文件类是否用 `symlink`
- 是否存在父子路径同时批准
- Node2 是否错误包含 Docker 路径

## 8.6 阶段F：日志迁移执行

### F-1. 轻量预演

```bash
bash node1_04_apply_logs_migration.sh --dry-run
bash node2_04_apply_logs_migration.sh --dry-run
bash node3_04_apply_logs_migration.sh --dry-run
```

注意：该预演仍可能创建部分目录和运行日志，不是完全只读。

### F-2. 正式执行

```bash
bash node1_04_apply_logs_migration.sh
bash node2_04_apply_logs_migration.sh
bash node3_04_apply_logs_migration.sh
```

### F-3. 执行后验证

验证内容：

```bash
mount | grep filedata
find /filedata/node1/meta/manifests -maxdepth 1 -type f
find /filedata/node2/meta/manifests -maxdepth 1 -type f
find /filedata/node3/meta/manifests -maxdepth 1 -type f
```

重点检查：

- `migration_state.tsv` 已记录
- 目录类日志已 bind mount
- 文件类日志已软链接
- 新日志仍在持续写入
- 原路径访问正常
- 监控/采集程序未中断

失败回滚：

```bash
bash node1_99_rollback_all.sh log
bash node2_99_rollback_all.sh log
bash node3_99_rollback_all.sh log
```

## 8.7 阶段G：最终验收

最终验收不是只看脚本跑完，而是要看业务和运维两个视角都过关。

验收标准：

1. 三台服务器分区挂载稳定
2. 三套业务的 MySQL 已落共享盘
3. 原 datadir 路径未变化
4. 已迁移日志正常写入共享盘
5. Node2 未迁移 Docker 容器日志
6. `/etc/fstab` 已补齐基础挂载项和 bind 项
7. 所有 `.bak_时间戳` 目录仍在
8. 已进入观察期

## 9. 回滚SOP

## 9.1 立即回滚触发条件

出现任一情况，立即停止并回滚：

- MySQL 拉不起来
- 页面打不开
- 登录失败
- 核心功能报错
- 数据不能写入
- 日志停止生成
- bind mount 丢失
- 权限异常

## 9.2 回滚动作

Node1：

```bash
bash node1_99_rollback_all.sh
bash node1_99_rollback_all.sh mysql
bash node1_99_rollback_all.sh log
```

Node2：

```bash
bash node2_99_rollback_all.sh
bash node2_99_rollback_all.sh mysql
bash node2_99_rollback_all.sh log
```

Node3：

```bash
bash node3_99_rollback_all.sh
bash node3_99_rollback_all.sh mysql
bash node3_99_rollback_all.sh log
```

## 9.3 回滚后必须验证

- bind mount 已卸载
- 软链接已删除
- 原始备份目录已恢复为正式路径
- `/etc/fstab` 本次追加项已清理
- MySQL 已恢复
- 页面和关键功能恢复正常

## 10. 观察期和收口

### 10.1 观察期要求

建议至少覆盖以下任一条件后再清理：

- 连续 24 小时稳定
- 完整覆盖 1 个业务高峰周期
- 完整覆盖 1 次批处理或定时任务运行周期

观察期内重点看：

- MySQL 运行是否稳定
- 日志写入是否连续
- 磁盘空间是否按预期释放
- 是否有监控或采集路径异常

### 10.2 清理准入条件

只有以下条件全部满足，才允许删除 `.bak_时间戳` 目录：

- 观察期通过
- 业务确认无异常
- 运维确认无需回滚
- 删除动作已单独审批

## 11. 现场执行顺序建议

建议实际执行时按下面顺序走：

1. 全员进群或电话桥，确认角色
2. 备份 `/etc/fstab`，采集基线
3. Node3 重分区并补齐 `fstab`
4. Node1 初始化并补齐 `fstab`
5. Node2 初始化并补齐 `fstab`
6. Node1 MySQL 预演 -> 正式切换 -> 业务验证
7. Node2 MySQL 预演 -> 正式切换 -> 业务验证
8. Node3 MySQL 预演 -> 正式切换 -> 业务验证
9. 三节点日志发现
10. 三节点人工审核 `approved_logs.tsv`
11. 三节点日志迁移预演 -> 正式迁移
12. 最终验收
13. 进入观察期
14. 观察期通过后再做备份目录清理

## 12. 本SOP配套文档

建议配合以下文档一起使用：

- [服务器磁盘技术实施总方案-单文档交付版.md](服务器磁盘技术实施总方案-单文档交付版.md)
- [服务器磁盘迁移现场实施SOP.md](服务器磁盘迁移现场实施SOP.md)
- [服务器磁盘迁移割接检查清单.md](服务器磁盘迁移割接检查清单.md)
- [三服务器磁盘治理与共享盘落盘技术实施方案.md](三服务器磁盘治理与共享盘落盘技术实施方案.md)

## 13. 最终建议

如果你要真上生产，最稳妥的做法不是“今天拿脚本、今晚就切”，而是：

1. 先把 Node2 双实例脚本问题处理掉
2. 再做一次 T-1 预检
3. 再按本SOP进正式窗口

这样做，现场才是真正可控、可验、可回滚的。
