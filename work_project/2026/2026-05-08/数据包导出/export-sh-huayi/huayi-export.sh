#!/bin/bash

# ===================== 配置区 =====================
FILE_ROOT="/opt/apphome/iipFile/attach"
ENCRYPT_PASSWORD="#Pecms@3957.,com!"   # 加密密码

# ===================== 导出主函数 =====================
do_export() {
    local PROJECT_ID=$1
#    local DISPATCH_ID="SELECT id FROM project_dispatch WHERE projectId='$PROJECT_ID'"
#    local DOC_ID="SELECT id FROM yw_supervision_file WHERE parent_id in (SELECT id FROM yw_supervision_file_parent WHERE dispatch_id in (${DISPATCH_IDS}) )"

    # 附件业务ID数组
    local FILE_BIZID_ARR=()

    # 查询项目信息是否存在
    local PROJECT_INFO=$(mysql --defaults-extra-file=/root/.my.cnf -se "
        SELECT id, name FROM project_management
        WHERE id='$PROJECT_ID'
        LIMIT 1;
    ")

    # 根据ID未查询到项目数据
    if [ -z "$PROJECT_INFO" ]; then
        echo -e "\n===== 错误 ====="
        echo "项目ID【$PROJECT_ID】不存在，数据库中无此记录！"
        echo "===============\n"
        exit 1
    fi
    # 获取项目名称
    local PROJECT_NAME=$(echo "$PROJECT_INFO" | awk '{print $2}')
    if [ -z "$PROJECT_NAME" ]; then
        echo -e "\n===== 警告 ====="
        echo "项目ID【$PROJECT_ID】存在，但【项目名称为空】，将使用默认名称"
        echo "===============\n"
        PROJECT_NAME="project_${PROJECT_ID}"
    fi

    # 替换空格及非法字符
    PROJECT_NAME=$(echo "$PROJECT_NAME" | sed 's/[\/:*?"<>|]/_/g' | sed 's/ /_/g')
    local DATE_STR=$(date +"%Y%m%d%H%M%S")
    local EXPORT_DIR="./${PROJECT_NAME}_${DATE_STR}"
    mkdir -p "$EXPORT_DIR"
    local BACKUP_FILE_DIR="${EXPORT_DIR}/attatchments"


    # 查询逗号分隔的 ID 列表；无数据时返回一个永远匹配不到的值
    query_id_list() {
        local sql="$1"
        mysql --defaults-extra-file=/root/.my.cnf -N -B -e "
            SET SESSION group_concat_max_len = 1024 * 1024;
            SELECT COALESCE(GROUP_CONCAT(QUOTE(id) SEPARATOR ','), QUOTE('__NO_ID__'))
            FROM (${sql}) t;
        "
    }
    DISPATCH_IDS=$(query_id_list "
        SELECT id
        FROM project_dispatch
        WHERE projectId = '$PROJECT_ID'
    ")

    DOC_IDS=$(query_id_list "
        SELECT f.id
        FROM yw_supervision_file f
        WHERE f.parent_id IN (
            SELECT p.id
            FROM yw_supervision_file_parent p
            WHERE p.dispatch_id IN (${DISPATCH_IDS})
        )
    ")
#    local JLRZ_DOC_ID=$DOC_IDS
    # ==============================================
    # 公共导出函数（内部使用外层变量）
    # ==============================================
    to_export() {
        local TABLE_NAME=$1
        local WHERE_CONDITION=$2
        local FILE_PATH="${EXPORT_DIR}/${TABLE_NAME}.sql"

        # 1. 查询该条件下是否有数据
#        local DATA_COUNT
#        DATA_COUNT=$(mysql --defaults-extra-file=/root/.my.cnf  -se "
#            SELECT COUNT(*) FROM ${TABLE_NAME} WHERE ${WHERE_CONDITION};
#        ")
#
#        # 2. 无数据则跳过，不生成文件
#        if [ -z "$DATA_COUNT" ] || [ "$DATA_COUNT" -eq 0 ]; then
#            echo "  → 无数据，跳过导出：${TABLE_NAME}"
#            return 0
#        fi
#
#        echo "→ 查询到【${DATA_COUNT}】条数据，导出表：${TABLE_NAME}"

        echo "→ 导出表：${TABLE_NAME}"
        mysql --defaults-extra-file=/root/.my.cnf \
        --default-character-set=utf8mb4 \
        -N -e "SELECT * FROM ${TABLE_NAME} WHERE ${WHERE_CONDITION}" \
        2>/dev/null \
        | while read -r line; do
        echo "INSERT INTO ${TABLE_NAME} VALUES ('$line');"
        done > "${FILE_PATH}"

        # 检查是否空文件
        if [ ! -s "$FILE_PATH" ]; then
            echo "  -> 无数据，删除空文件：${TABLE_NAME}.sql"
            rm -f "$FILE_PATH"
        fi
    }

    export_table() {
        local TABLE_NAME=$1
        local WHERE_CONDITION=$2
        local SYS_FILE_FLAG=$3
        to_export "$TABLE_NAME" "$WHERE_CONDITION"

        if [ -n "$SYS_FILE_FLAG" ] && [ "$SYS_FILE_FLAG" -eq 1 ]; then
            echo "==> Reading business IDs"
            while read -r bid; do
                if [ -n "$bid" ]; then
                    FILE_BIZID_ARR+=("$bid")
                fi
            done < <(mysql --defaults-extra-file=/root/.my.cnf  -se "SELECT id FROM ${TABLE_NAME} WHERE ${WHERE_CONDITION};")
        fi
    }

    export_by_ids() {
        local ids=$(IFS=,; echo "${FILE_BIZID_ARR[*]}")
        if [ -z "$ids" ]; then
            echo "==> No business ID"
            return 0
        fi

        # 导出附件相关表数据
        to_export "sys_file_upload" "biz_id in (${ids})"
        to_export "sys_file" "id in (SELECT file_id FROM sys_file_upload WHERE biz_id in (${ids}))"

        mkdir -p "$BACKUP_FILE_DIR"

        echo -e "\n==> 开始复制附件..."
        mysql --defaults-extra-file=/root/.my.cnf -N --default-character-set=utf8mb4 -se "
        SELECT DISTINCT f.file_path
        FROM sys_file f
        JOIN sys_file_upload u ON f.id = u.file_id
        WHERE u.biz_id IN (${ids});
        " | while read -r fp; do
            [ -z "$fp" ] && continue
            echo "文件路径 => ${fp}"
            local real_file="${FILE_ROOT}${fp}"
            local dest_file="${BACKUP_FILE_DIR}/${fp}"
            local dest_dir=$(dirname "$dest_file")
            mkdir -p "$dest_dir"
            if [ -f "$real_file" ]; then
                echo "复制成功: $real_file"
                cp -v "$real_file" "$dest_file"
            else
                echo "文件不存在: $real_file"
            fi
        done
        echo -e "\n==> 附件导出完成！"
    }

    export_group() {
        local primary_table=$1
        local secondary_tables=$2
        local tertiary_tables=$3
        local param=$4
        local mparam=$6
        if [ -z "$param" ]; then
            param="pid"
        fi
        if [ -z "$mparam" ]; then
            mparam="id"
        fi

        local main_cond="docid IN (${DOC_IDS})"

        export_table "$primary_table" "$main_cond" 0

        local secondary_cond="$param IN (SELECT $mparam FROM $primary_table WHERE $main_cond)"
        local secondary_union=""

        for sec in $secondary_tables; do
            export_table "$sec" "$secondary_cond" 0
            if [ -n "$secondary_union" ]; then
                secondary_union="$secondary_union UNION "
            fi
            secondary_union="$secondary_union SELECT id FROM $sec WHERE $secondary_cond"
        done

        local tparam=$5
        if [ -n "$tparam" ]; then
            param=$tparam
        fi
        if [ -n "$tertiary_tables" ] && [ -n "$secondary_union" ]; then
            local tertiary_cond="$param IN ($secondary_union)"
            for tert in $tertiary_tables; do
                export_table "$tert" "$tertiary_cond" 0
            done
        fi
    }

    echo "========================================"
    echo "Export project ID: $PROJECT_ID"
    echo "Dir: $EXPORT_DIR"
    echo "========================================"

    # 导出业务表
    export_table "project_management" "id='$PROJECT_ID'" 0
    export_table "project_apparatus" "project_id='$PROJECT_ID'" 0
    export_table "project_dispatch" "projectId='$PROJECT_ID'" 0
    export_table "project_dispatch_user" "dispatch_id IN (${DISPATCH_IDS})" 0
    export_table "dispatch_change" "projectId='$PROJECT_ID'" 0
    export_table "dispatch_history_user" "dispatch_id IN (${DISPATCH_IDS})" 0
    export_table "dispatch_signin" "dispatch_id IN (${DISPATCH_IDS})" 0
    export_table "review_dispatch" "process_instance_id IN (SELECT process_instance_id from project_dispatch WHERE projectId IN ('$PROJECT_ID'))" 0
    export_table "project_disclose" "dispatchid IN (${DISPATCH_IDS})" 1
    export_table "project_device_management" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "project_device_management_temp" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "dispatch_change_device" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "dispatch_remarks" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "dispatch_change_remarks" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "project_dispatch_requirements" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "dispatch_change_requirements" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "sys_work_contact" "fid IN (${DISPATCH_IDS})" 1
    export_table "sys_rep_notice" "fid IN (${DISPATCH_IDS})" 1
    export_table "major_equipment_problems" "fid IN (${DISPATCH_IDS})" 1
    # 监理报告
    export_table "rep_sbjlbg" "docid IN (${DOC_IDS})" 0
    export_table "rep_sbjlbg_his" "docid IN (${DOC_IDS})" 0
    export_table "rep_zyjlxm" "docid IN (${DOC_IDS})" 0
    export_table "rep_zyjlxm_his" "docid IN (${DOC_IDS})" 0
    # 监理总结
    export_table "yw_supervision_summary" "dispatch_id IN (${DISPATCH_IDS})" 0
    export_table "yw_supervision_summary_his" "dispatch_id IN (${DISPATCH_IDS})" 0
    export_table "rep_supervision_summary" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "rep_supervision_summary_his" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "rep_supervision_summary_sblist" "pid IN (SELECT id FROM rep_supervision_summary WHERE dispatchid IN (${DISPATCH_IDS}))"
    export_table "rep_supervision_summary_sblist_his" "pid IN (SELECT id FROM rep_supervision_summary_his WHERE dispatchid IN (${DISPATCH_IDS}))"

    # 文档管理
    export_table "yw_ralated_files" "dispatchid IN (${DISPATCH_IDS})" 0
    export_table "yw_ralated_files_list" "dispatchid IN (${DISPATCH_IDS})" 1

    # 监理周报
    export_table "yw_supervision_weekly" "dispatch_id IN (${DISPATCH_IDS})" 0
    local YW_WEEKLY_COND="SELECT id FROM yw_supervision_weekly WHERE dispatch_id IN (${DISPATCH_IDS})"
    export_table "sys_weekly" "documentid IN ($YW_WEEKLY_COND)" 0
    local SYS_WEEKLY_COND="SELECT id FROM sys_weekly WHERE documentid IN ($YW_WEEKLY_COND)"
    export_table "sys_weekly_equipment" "documentid IN ($SYS_WEEKLY_COND)" 0
    export_table "sys_weekly_img" "parent_id IN ($SYS_WEEKLY_COND)" 0
    export_table "sys_weekly_production_processing_assembly" "documentid IN ($SYS_WEEKLY_COND)" 0

    #执行状态
    DISPATCH_EXECUTION_ID="SELECT id FROM dispatch_execution WHERE dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0"
    export_table "dispatch_execution" "id IN ($DISPATCH_EXECUTION_ID) AND del_flag=0" 0
#    export_table "dispatch_execution_actual_user" "dispatch_execution_id IN ($DISPATCH_EXECUTION_ID)" 0
    export_table "dispatch_execution_time" "dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0" 0
    #人员交接
    HANDOVER_ID="SELECT id FROM yw_handover_main WHERE dispatchid IN (${DISPATCH_IDS}) AND del_flag=0"
    export_table "yw_handover_main" "id IN ($HANDOVER_ID)" 1
    export_table "yw_handover_data" "handoverid IN ($HANDOVER_ID)" 0
    export_table "yw_handover_devicesdata" "handoverid IN ($HANDOVER_ID)" 0
    export_table "yw_handover_problemsdata" "handoverid IN ($HANDOVER_ID) AND del_flag=0" 0
    #文档目录
    export_table "yw_supervision_file_parent" "dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0" 0
    export_table "yw_supervision_file_parent_his" "dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0" 0
    FILE_PARENT_ID="SELECT id FROM yw_supervision_file_parent WHERE dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0"
    export_table "yw_supervision_file" "parent_id IN ($FILE_PARENT_ID) AND del_flag=0" 0
    export_table "yw_supervision_file_his" "parent_id IN ($FILE_PARENT_ID) AND del_flag=0" 0
    YW_CATALOGUE_ID="SELECT yw_catalogue_id FROM yw_supervision_file WHERE parent_id IN ($FILE_PARENT_ID) AND del_flag=0"
    export_table "yw_supervision_catalogue" "id IN ($YW_CATALOGUE_ID) AND del_flag=0" 1
    #录入细则必选表单
    DEVICE_ID="SELECT id FROM project_device_management WHERE dispatchid IN (${DISPATCH_IDS}) AND del_flag=0"
    export_table "rep_write_explain" "deviceid IN ($DEVICE_ID)" 0      #编制说明
    export_table "rep_write_explain_his" "deviceid IN ($DEVICE_ID)" 0  #编制说明-历史

    ZYCS_ZDSB_ID="SELECT ID FROM rep_sbzyjscsjg_zdsb WHERE deviceid IN ($DEVICE_ID)"
    export_table "rep_sbzyjscsjg_zdsb" "id IN ($ZYCS_ZDSB_ID)" 0     #主要参数（转动设备）-主表
    export_table "rep_sbzyjscsjg_zdsb_his" "id IN ($ZYCS_ZDSB_ID)" 0 #主要参数（转动设备）-主表(历史)
    export_table "rep_sbzyjscsjg_zdsb_list" "pid IN ($ZYCS_ZDSB_ID)" 0     #主要参数（转动设备）-明细表
    export_table "rep_sbzyjscsjg_zdsb_list_his" "pid IN ($ZYCS_ZDSB_ID)" 0 #主要参数（转动设备）-明细表(历史)

    ZYCS_JSB_ID="SELECT ID FROM rep_sbzyjscsjg_jsb WHERE deviceid IN ($DEVICE_ID)"
    export_table "rep_sbzyjscsjg_jsb" "id IN ($ZYCS_JSB_ID)" 0     #主要参数（静设备）
    export_table "rep_sbzyjscsjg_jsb_his" "id IN ($ZYCS_JSB_ID)" 0 #主要参数（静设备）-历史
    export_table "rep_sbzyjscsjg_jsb_gckc_list" "pid IN ($ZYCS_JSB_ID)" 0
    export_table "rep_sbzyjscsjg_jsb_gckc_list_his" "pid IN ($ZYCS_JSB_ID)" 0
    export_table "rep_sbzyjscsjg_jsb_xm_list" "pid IN ($ZYCS_JSB_ID)" 0
    export_table "rep_sbzyjscsjg_jsb_xm_list_his" "pid IN ($ZYCS_JSB_ID)" 0

    ZYCS_F_ZDSB_ID="SELECT ID FROM rep_zyjscsjg_sb WHERE deviceid IN ($DEVICE_ID)"
    export_table "rep_zyjscsjg_sb" "id IN ($ZYCS_F_ZDSB_ID)" 0           #主要参数（非静设备、非转动设备）
    export_table "rep_zyjscsjg_sb_his" "deviceid IN ($ZYCS_F_ZDSB_ID)" 0 #主要参数（非静设备、非转动设备）-历史
    export_table "rep_zyjscsjg_sb_data" "fid IN ($ZYCS_F_ZDSB_ID)" 0
    export_table "rep_zyjscsjg_sb_data_his" "fid IN ($ZYCS_F_ZDSB_ID)" 0
    export_table "rep_zyjscsjg_sb_list" "fid IN ($ZYCS_F_ZDSB_ID)" 0
    export_table "rep_zyjscsjg_sb_list_his" "fid IN ($ZYCS_F_ZDSB_ID)" 0

    export_table "rep_jlyj" "deviceid IN ($DEVICE_ID)" 0     #监理依据
    export_table "rep_jlyj_his" "deviceid IN ($DEVICE_ID)" 0 #监理依据-历史

    CONTROL_POINTS_ID="SELECT ID FROM rep_control_points WHERE deviceid IN ($DEVICE_ID)"
    export_table "rep_control_points" "id IN ($CONTROL_POINTS_ID)" 0     #控制要点
    export_table "rep_control_points_his" "id IN ($CONTROL_POINTS_ID)" 0 #控制要点（历史）
    export_table "rep_control_points_list" "fid IN ($CONTROL_POINTS_ID)" 0     #控制要点-明细
    export_table "rep_control_points_list_his" "fid IN ($CONTROL_POINTS_ID)" 0 #控制要点-明细（历史）

    export_table "rep_jldg_fm" "docid IN (${DOC_IDS})" 0      #监理大纲-封面
    export_table "rep_jldg_fm_his" "docid IN (${DOC_IDS})" 0  #监理大纲-封面(历史)

    export_table "rep_jldg_ztnr" "docid IN (${DOC_IDS})" 0      #监理大纲-主体内容
    export_table "rep_jldg_ztnr_his" "docid IN (${DOC_IDS})" 0  #监理大纲-主体内容(历史)
    YW_JLDG_ZTNR_SBQD_ID="SELECT id FROM rep_jldg_ztnr WHERE docid IN (${DOC_IDS})"
    export_table "rep_jldg_ztnr_sbqd" "pid IN ($YW_JLDG_ZTNR_SBQD_ID)" 0      #监理大纲-主体内容-设备清单
    export_table "rep_jldg_ztnr_sbqd_his" "pid IN ($YW_JLDG_ZTNR_SBQD_ID)" 0  #监理大纲-主体内容-设备清单(历史)

    export_table "rep_jzjsyjh" "docid IN (${DOC_IDS})" 0      #监理大纲-监造检试验计划-主表
    export_table "rep_jzjsyjh_his" "docid IN (${DOC_IDS})" 0  #监理大纲-监造检试验计划-主表(历史)
    JLDG_JZJSYJH_PID="SELECT id FROM rep_jzjsyjh WHERE docid IN (${DOC_IDS})"
    export_table "rep_jzjsyjh_list" "pid IN ($JLDG_JZJSYJH_PID)" 0  #监理大纲-监造检试验计划-明细表
    export_table "rep_jzjsyjh_list_his" "pid IN ($JLDG_JZJSYJH_PID)" 0  #监理大纲-监造检试验计划-明细表(历史)

    #监理日志
    export_table "yw_supervision_log" "dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0" 0 #监理日志列表
    #监理日志-问题及解决
    YW_SUPERVISION_LOG_ID="SELECT id FROM yw_supervision_log WHERE dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0"
    export_table "yw_supervision_log_job" "parent_id IN ($YW_SUPERVISION_LOG_ID) AND del_flag=0" 1 #监理日志-问题描述
    export_table "yw_supervision_log_job_repair" "parent_id IN ($YW_SUPERVISION_LOG_ID) AND del_flag=0" 1 #监理日志-问题描述
    export_table "yw_supervision_log_content_repair" "parent_id IN ($YW_SUPERVISION_LOG_ID) AND del_flag=0" 1 #监理日志-检验内容
    export_table "yw_abnormal_problem" "dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0" 1 #监理日志-异常问题
    export_table "yw_abnormal_problem_his" "dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0" 1 #监理日志-异常问题
    export_table "yw_abnormal_problem_repair" "dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0" 1 #监理日志-异常问题
    export_table "yw_supervision_log_repair_bind" "dispatch_id IN (${DISPATCH_IDS}) AND del_flag=0" 0 #监理日志-补录绑定

    #监理日志-报表
    ttfdjzyhxjyjzjlb_data_id="SELECT id FROM rep_ttfdjzyhxjyjzjlb_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_ttfdjzyhxjyjzjlb_data_daily" "id IN ($ttfdjzyhxjyjzjlb_data_id)" 0 #报表-筒体（分段）基准圆划线检验见证记录表
    export_table "rep_ttfdjzyhxjyjzjlb_data_list_daily" "pid IN ($ttfdjzyhxjyjzjlb_data_id)" 0

    tt_fd_jyjl_id="SELECT id FROM rep_tt_fd_jyjl_daily WHERE docid IN (${DOC_IDS})"
    tt_fd_jyjl_pid="SELECT id FROM rep_tt_fd_jyjl_list_daily WHERE pid IN ($tt_fd_jyjl_id)"
    export_table "rep_tt_fd_jyjl_daily" "id IN ($tt_fd_jyjl_id)" 0 #报表-筒体检验见证记录表
    export_table "rep_tt_fd_jyjl_list_daily" "pid IN ($tt_fd_jyjl_id)" 0
    export_table "rep_tt_fd_jyjl_list_list_daily" "pid IN ($tt_fd_jyjl_pid)" 0

    fdtqztzzjcjlb_id="SELECT id FROM rep_fdtqztzzjcjlb_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_fdtqztzzjcjlb_data_daily" "id IN ($fdtqztzzjcjlb_id)" 0 #报表-分段塔器整体组装检查记录表
    export_table "rep_fdtqztzzjcjlb_data_list_daily" "pid IN ($fdtqztzzjcjlb_id)" 0

    bzcbcx_dctjbz_data_id="SELECT id FROM rep_bzcbcx_dctjbz_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_bzcbcx_dctjbz_data_daily" "id IN ($bzcbcx_dctjbz_data_id)" 0 #报表-包扎层板成型（多层筒节包扎）检验见证记录表
    export_table "rep_bzcbcx_dctjbz_data_list_daily" "pid IN ($bzcbcx_dctjbz_data_id)" 0

    bzcbcx_dcztbz_data_id="SELECT id FROM rep_bzcbcx_dctjbz_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_bzcbcx_dcztbz_data_daily" "id IN ($bzcbcx_dcztbz_data_id)" 0 #报表-包扎层板成型（多层整体包扎）检验见证记录表
    export_table "rep_bzcbcx_dcztbz_data_list_daily" "pid IN ($bzcbcx_dcztbz_data_id)" 0

    ecnjyzzccjcjl_id="SELECT id FROM rep_ecnjyzzccjcjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_ecnjyzzccjcjl_daily" "id IN ($ecnjyzzccjcjl_id)" 0 #报表-二次内件预组装尺寸检查记录表
    export_table "rep_ecnjyzzccjcjl_list_daily" "pid IN ($ecnjyzzccjcjl_id)" 0

    basics_test_id="SELECT id FROM rep_basics_test_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_basics_test_daily" "id IN ($basics_test_id)" 0 #报表-基础模板检验见证记录表
    export_table "rep_basics_test_list_daily" "pid IN ($basics_test_id)" 0

    zzjyjzjlb_data_id="SELECT id FROM rep_zzjyjzjlb_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_zzjyjzjlb_data_daily" "id IN ($zzjyjzjlb_data_id)" 0 #报表-支座检验见证记录表
    export_table "rep_zzjyjzjlb_data_list_daily" "pid IN ($zzjyjzjlb_data_id)" 0

    withstand_appearance_id="SELECT id FROM rep_withstand_appearance_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_withstand_appearance_daily" "id IN ($withstand_appearance_id)" 0 #报表-耐压试验前外观及尺寸检查见证记录表
    export_table "rep_withstand_appearance_list_daily" "documentid IN ($withstand_appearance_id)" 0

    glbzjnysyjyjl_id="SELECT id FROM rep_glbzjnysyjyjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_glbzjnysyjyjl_daily" "id IN ($glbzjnysyjyjl_id)" 0 #报表-管路布置及耐压试验检验记录表
    export_table "rep_glbzjnysyjyjl_list_daily" "pid IN ($glbzjnysyjyjl_id)" 0

    sand_blasting_paint_id="SELECT id FROM rep_sand_blasting_paint_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_sand_blasting_paint_daily" "id IN ($sand_blasting_paint_id)" 0 #报表-喷砂油漆酸洗钝化检查见证记录表
    export_table "rep_sand_blasting_paint_list_daily" "documentid IN ($sand_blasting_paint_id)" 0

    packing_record_id="SELECT id FROM rep_packing_record_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_packing_record_daily" "id IN ($packing_record_id)" 0 #报表-包装和备品备件检验记录表
    export_table "rep_packing_record_list_daily" "documentid IN ($packing_record_id)" 0

    completion_data_id="SELECT id FROM rep_completion_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_completion_data_daily" "id IN ($completion_data_id)" 0 #报表-竣工资料审查记录表
    export_table "rep_completion_data_list_daily" "documentid IN ($completion_data_id)" 0

    other_check_id="SELECT id FROM rep_other_check_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_other_check_daily" "id IN ($other_check_id)" 0 #报表-其他检验记录表
    export_table "rep_other_check_list_daily" "documentid IN ($other_check_id)" 0

    tzgywjscjl_id="SELECT id FROM rep_tzgywjscjl_daily WHERE docid IN (${DOC_IDS})"
    tzgywjscjl_pid="SELECT id FROM rep_tzgywjscjl_list_daily WHERE pid IN ($tzgywjscjl_id)"
    export_table "rep_tzgywjscjl_daily" "id IN ($tzgywjscjl_id)" 0 #报表-图纸、工艺文件审查记录表
    export_table "rep_tzgywjscjl_list_daily" "pid IN ($tzgywjscjl_id)" 0
    export_table "rep_tzgywjscjl_list_list_daily" "pid IN ($tzgywjscjl_pid)" 0

    welding_technology_id="SELECT id FROM rep_welding_technology_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_welding_technology_daily" "id IN ($welding_technology_id)" 0 #报表-焊接工艺评定检验记录表
    export_table "rep_weld_technology_list_daily" "pid IN ($welding_technology_id)" 0

    material_quality_id="SELECT id FROM rep_material_quality_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_material_quality_daily" "id IN ($material_quality_id)" 0 #报表-主要原材料检验见证记录表
    export_table "rep_material_quality_list_daily" "pid IN ($material_quality_id)" 0

    incoming_plate_id="SELECT id FROM rep_incoming_plate_daily WHERE docid IN (${DOC_IDS})"
    incoming_plate_pid="SELECT id FROM rep_incoming_plate_list_daily WHERE pid IN ($incoming_plate_id)"
    export_table "rep_incoming_plate_daily" "id IN ($incoming_plate_id)" 0 #报表-板材入厂检验见证记录表
    export_table "rep_incoming_plate_list_daily" "pid IN ($incoming_plate_id)" 0
    export_table "rep_incoming_plate_list_list_daily" "pid IN ($incoming_plate_pid)" 0

    incoming_pipe_id="SELECT id FROM rep_incoming_pipe_daily WHERE docid IN (${DOC_IDS})"
    incoming_pipe_pid="SELECT id FROM rep_incoming_pipe_list_daily WHERE pid IN ($incoming_pipe_id)"
    export_table "rep_incoming_pipe_daily" "id IN ($incoming_pipe_id)" 0 #报表-管材入厂检验见证记录表
    export_table "rep_incoming_pipe_list_daily" "pid IN ($incoming_pipe_id)" 0
    export_table "rep_incoming_pipe_list_list_daily" "pid IN ($incoming_pipe_pid)" 0

    incoming_forging_id="SELECT id FROM rep_incoming_forging_daily WHERE docid IN (${DOC_IDS})"
    incoming_forging_pid="SELECT id FROM rep_incoming_forging_list_daily WHERE pid IN ($incoming_forging_id)"
    export_table "rep_incoming_forging_daily" "id IN ($incoming_forging_id)" 0 #报表-锻件入厂检验见证记录表
    export_table "rep_incoming_forging_list_daily" "pid IN ($incoming_forging_id)" 0
    export_table "rep_incoming_forging_list_list_daily" "pid IN ($incoming_forging_pid)" 0

    incoming_hc_id="SELECT id FROM rep_incoming_hc_daily WHERE docid IN (${DOC_IDS})"
    incoming_hc_pid="SELECT id FROM rep_incoming_hc_list_daily WHERE pid IN ($incoming_hc_id)"
    export_table "rep_incoming_hc_daily" "id IN ($incoming_hc_id)" 0 #报表-焊材入厂检验见证记录表
    export_table "rep_incoming_hc_list_daily" "pid IN ($incoming_hc_id)" 0
    export_table "rep_incoming_hc_list_list_daily" "pid IN ($incoming_hc_pid)" 0

    retest_material_id="SELECT id FROM rep_retest_material_daily WHERE docid IN (${DOC_IDS})"
    retest_material_pid="SELECT id FROM rep_retest_material_list WHERE pid IN ($retest_material_id)"
    export_table "rep_retest_material_daily" "id IN ($retest_material_id)" 0 #报表-材料复验检查记录表
    export_table "rep_retest_material_list_daily" "pid IN ($retest_material_id)" 0
    export_table "rep_retest_material_list_list_daily" "pid IN ($retest_material_pid)" 0

    xljyjl_id="SELECT id FROM rep_xljyjl_daily WHERE docid IN (${DOC_IDS})"
    xljyjl_pid="SELECT id FROM rep_xljyjl_list_daily WHERE pid IN ($xljyjl_id)"
    export_table "rep_xljyjl_daily" "id IN ($xljyjl_id)" 0 #报表-下料检验见证记录表
    export_table "rep_xljyjl_list_daily" "pid IN ($xljyjl_id)" 0
    export_table "rep_xljyjl_list_jyxm_daily" "pid IN ($xljyjl_pid)" 0

    tjjyjzjl_id="SELECT id FROM rep_tjjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    tjjyjzjl_pid="SELECT id FROM rep_tjjyjzjl_list_daily WHERE pid IN ($tjjyjzjl_id)"
    export_table "rep_tjjyjzjl_daily" "id IN ($tjjyjzjl_id)" 0 #报表-筒节检验见证记录表
    export_table "rep_tjjyjzjl_list_daily" "pid IN ($tjjyjzjl_id)" 0
    export_table "rep_tjjyjzjl_list_jyxm_daily" "pid IN ($tjjyjzjl_pid)" 0

    cxftjyjzjl_id="SELECT id FROM rep_cxftjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_cxftjyjzjl_daily" "id IN ($cxftjyjzjl_id)" 0 #报表-成型（封头）检验见证记录表
    export_table "rep_cxftjyjzjl_list_daily" "pid IN ($cxftjyjzjl_id)" 0

    cxztjyjzjl_id="SELECT id FROM rep_cxztjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_cxztjyjzjl_daily" "id IN ($cxztjyjzjl_id)" 0 #报表-成型（锥体)检验见证记录表
    export_table "rep_cxztjyjzjl_list_daily" "pid IN ($cxztjyjzjl_id)" 0

    flange_check_id="SELECT id FROM rep_flange_check_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_flange_check_daily" "id IN ($flange_check_id)" 0 #报表-成品法兰检验见证记录表
    export_table "rep_flange_check_list_daily" "pid IN ($flange_check_id)" 0

    cxgjjyjzjlb_id="SELECT id FROM rep_cxgjjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    cxgjjyjzjlb_pid="SELECT id FROM rep_cxgjjyjzjlb_list_daily WHERE pid IN ($cxgjjyjzjlb_id)"
    export_table "rep_cxgjjyjzjlb_daily" "id IN ($cxgjjyjzjlb_id)" 0 #报表-成型管件检验见证记录表
    export_table "rep_cxgjjyjzjlb_list_daily" "pid IN ($cxgjjyjzjlb_id)" 0
    export_table "rep_cxgjjyjzjlb_list_list_daily" "pid IN ($cxgjjyjzjlb_pid)" 0

    uxhrgcpjyjzjl_id="SELECT id FROM rep_uxhrgcpjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    uxhrgcpjyjzjl_pid="SELECT id FROM rep_uxhrgcpjyjzjl_list_daily WHERE pid IN ($uxhrgcpjyjzjl_id)"
    export_table "rep_uxhrgcpjyjzjl_daily" "id IN ($uxhrgcpjyjzjl_id)" 0 #报表-U型换热管（成品）检验见证记录表
    export_table "rep_uxhrgcpjyjzjl_list_daily" "pid IN ($uxhrgcpjyjzjl_id)" 0
    export_table "rep_uxhrgcpjyjzjl_list_list_daily" "pid IN ($uxhrgcpjyjzjl_pid)" 0

    gbcpjyjzjl_id="SELECT id FROM rep_gbcpjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    gbcpjyjzjl_pid="SELECT id FROM rep_gbcpjyjzjl_list_daily WHERE pid IN ($gbcpjyjzjl_id)"
    export_table "rep_gbcpjyjzjl_daily" "id IN ($gbcpjyjzjl_id)" 0 #报表-管板（成品）检验见证记录表
    export_table "rep_gbcpjyjzjl_list_daily" "pid IN ($gbcpjyjzjl_id)" 0
    export_table "rep_gbcpjyjzjl_list_list_daily" "pid IN ($gbcpjyjzjl_pid)" 0

    zlbcpjyjzjl_id="SELECT id FROM rep_zlbcpjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    zlbcpjyjzjl_pid="SELECT id FROM rep_zlbcpjyjzjl_list_daily WHERE pid IN ($zlbcpjyjzjl_id)"
    export_table "rep_zlbcpjyjzjl_daily" "id IN ($zlbcpjyjzjl_id)" 0 #报表-折流板（成品）检验见证记录表
    export_table "rep_zlbcpjyjzjl_list_daily" "pid IN ($zlbcpjyjzjl_id)" 0
    export_table "rep_zlbcpjyjzjl_list_list_daily" "pid IN ($zlbcpjyjzjl_pid)" 0

    fbftjyjzjlb_data_id="SELECT id FROM rep_fbftjyjzjlb_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_fbftjyjzjlb_data_daily" "id IN ($fbftjyjzjlb_data_id)" 0 #报表-分瓣封头检验见证记录表
    export_table "rep_fbftjyjzjlb_data_list_daily" "pid IN ($fbftjyjzjlb_data_id)" 0

    fpztjyjzjlb_data_id="SELECT id FROM rep_fpztjyjzjlb_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_fpztjyjzjlb_data_daily" "id IN ($fpztjyjzjlb_data_id)" 0 #报表-分片锥体检验见证记录表
    export_table "rep_fpztjyjzjlb_data_list_daily" "pid IN ($fpztjyjzjlb_data_id)" 0

    ylrqjyjlb_id="SELECT id FROM rep_ylrqjyjlb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_ylrqjyjlb_daily" "id IN ($ylrqjyjlb_id)" 0 #报表-压力容器检验记录表
    export_table "rep_ylrqjyjlb_list_daily" "pid IN ($ylrqjyjlb_id)" 0

    wxwgjrcjyjlb_id="SELECT id FROM rep_wxwgjrcjyjlb_daily WHERE docid IN (${DOC_IDS})"
    wxwgjrcjyjlb_pid="SELECT id FROM rep_wxwgjrcjyjlb_list_daily WHERE pid IN ($wxwgjrcjyjlb_id)"
    export_table "rep_wxwgjrcjyjlb_daily" "id IN ($wxwgjrcjyjlb_id)" 0 #报表-外协/外购件入厂检验记录表
    export_table "rep_wxwgjrcjyjlb_list_daily" "pid IN ($wxwgjrcjyjlb_id)" 0
    export_table "rep_wxwgjrcjyjlb_list_list_daily" "pid IN ($wxwgjrcjyjlb_pid)" 0

    wgjjcjz_id="SELECT id FROM rep_wgjjcjz_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_wgjjcjz_daily" "id IN ($wgjjcjz_id)" 0 #报表-外购件检查见证表
    export_table "rep_wgjjcjz_list_daily" "pid IN ($wgjjcjz_id)" 0

    hjjyjl_id="SELECT id FROM rep_hjjyjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_hjjyjl_daily" "id IN ($hjjyjl_id)" 0 #报表-焊接过程检验记录表
    export_table "rep_hjjyjl_list_daily" "pid IN ($hjjyjl_id)" 0

    jkhxkkjzjk_id="SELECT id FROM rep_jkhxkkjzjk_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_jkhxkkjzjk_daily" "id IN ($jkhxkkjzjk_id)" 0 #报表-管口划线开孔见证记录表
    export_table "rep_jkhxkkjzjk_list_daily" "pid IN ($jkhxkkjzjk_id)" 0

    jgzzjyjzjl_id="SELECT id FROM rep_jgzzjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_jgzzjyjzjl_daily" "id IN ($jgzzjyjzjl_id)" 0 #报表-接管组装检验见证记录表
    export_table "rep_jgzzjyjzjl_list_daily" "pid IN ($jgzzjyjzjl_id)" 0

    gszzjcxjyjzjl_data_id="SELECT id FROM rep_gszzjcxjyjzjl_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_gszzjcxjyjzjl_data_daily" "id IN ($gszzjcxjyjzjl_data_id)" 0 #报表-管束组装及穿芯检验见证记录表
    export_table "rep_gszzjcxjyjzjl_data_list_daily" "pid IN ($gszzjcxjyjzjl_data_id)" 0

    hrgygbzjjyjzjlb_data_id="SELECT id FROM rep_hrgygbzjjyjzjlb_data_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_hrgygbzjjyjzjlb_data_daily" "id IN ($hrgygbzjjyjzjlb_data_id)" 0 #报表-换热管与管板胀接检验见证记录表
    export_table "rep_hrgygbzjjyjzjlb_data_list_daily" "pid IN ($hrgygbzjjyjzjlb_data_id)" 0

    tnjccjcjl_id="SELECT id FROM rep_tnjccjcjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_tnjccjcjl_daily" "id IN ($tnjccjcjl_id)" 0 #报表-塔内件尺寸检查记录表
    export_table "rep_tnjccjcjl_list_daily" "pid IN ($tnjccjcjl_id)" 0

    yhjjyjzjl_id="SELECT id FROM rep_yhjjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_yhjjyjzjl_daily" "id IN ($yhjjyjzjl_id)" 0 #报表-预焊件检验见证记录表
    export_table "rep_yhjjyjzjl_list_daily" "pid IN ($yhjjyjzjl_id)" 0

    zzjcjz_id="SELECT id FROM rep_zzjcjz_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_zzjcjz_daily" "id IN ($zzjcjz_id)" 0 #报表-总装检查见证表
    export_table "rep_zzjcjz_list_daily" "pid IN ($zzjcjz_id)" 0

    wgjccjcjl_id="SELECT id FROM rep_wgjccjcjl_daily WHERE docid IN (${DOC_IDS})"
    wgjccjcjl_pid="SELECT id FROM rep_wgjccjcjl_list_daily WHERE pid IN ($wgjccjcjl_id)"
    export_table "rep_wgjccjcjl_daily" "id IN ($wgjccjcjl_id)" 0 #报表-外观及尺寸检查见证记录表
    export_table "rep_wgjccjcjl_list_daily" "pid IN ($wgjccjcjl_id)" 0
    export_table "rep_wgjccjcjl_list_list_daily" "pid IN ($wgjccjcjl_pid)" 0

    sjjyjl_id="SELECT id FROM rep_sjjyjl_daily WHERE docid IN (${DOC_IDS})"
    sjjyjl_pid="SELECT id FROM rep_sjjyjl_list_daily WHERE pid IN ($sjjyjl_id)"
    export_table "rep_sjjyjl_daily" "id IN ($sjjyjl_id)" 0 #报表-试件检验记录表
    export_table "rep_sjjyjl_list_daily" "pid IN ($sjjyjl_id)" 0
    export_table "rep_sjjyjl_list_list_daily" "pid IN ($sjjyjl_pid)" 0

    radial_id="SELECT id FROM rep_radial_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_radial_daily" "id IN ($radial_id)" 0 #报表-射线检验记录表
    export_table "rep_radial_list_daily" "pid IN ($radial_id)" 0

    ultrasonic_id="SELECT id FROM rep_ultrasonic_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_ultrasonic_daily" "id IN ($ultrasonic_id)" 0 #报表-超声检验记录表
    export_table "rep_ultrasonic_list_daily" "pid IN ($ultrasonic_id)" 0

    infiltration_id="SELECT id FROM rep_infiltration_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_infiltration_daily" "id IN ($infiltration_id)" 0 #报表-磁粉/渗透检验记录表
    export_table "rep_infiltration_list_daily" "pid IN ($infiltration_id)" 0

    wsjcjl_id="SELECT id FROM rep_wsjcjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_wsjcjl_daily" "id IN ($wsjcjl_id)" 0 #报表-无损检测记录表
    export_table "rep_wsjcjl_list_daily" "pid IN ($wsjcjl_id)" 0

    rcljyjla_id="SELECT id FROM rep_rcljyjla_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_rcljyjla_daily" "id IN ($rcljyjla_id)" 0 #报表-热处理检验记录表a
    export_table "rep_rcljyjla_list_daily" "pid IN ($rcljyjla_id)" 0

    heat_treatment_id="SELECT id FROM rep_heat_treatment_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_heat_treatment_daily" "id IN ($heat_treatment_id)" 0 #报表-热处理检验记录表b
    export_table "rep_heat_treatment_list_daily" "pid IN ($heat_treatment_id)" 0

    slsyjyjlb_id="SELECT id FROM rep_slsyjyjlb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_slsyjyjlb_daily" "id IN ($slsyjyjlb_id)" 0 #报表-深冷试验检验记录表
    export_table "rep_slsyjyjlb_list_daily" "pid IN ($slsyjyjlb_id)" 0

    ydjyjlb_check_id="SELECT id FROM rep_ydjyjlb_check_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_ydjyjlb_check_daily" "id IN ($ydjyjlb_check_id)" 0 #报表-硬度检验记录表
    export_table "rep_ydjyjlb_check_list_daily" "pid IN ($ydjyjlb_check_id)" 0

    rotor_runout_id="SELECT id FROM rep_rotor_runout_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_rotor_runout_daily" "id IN ($rotor_runout_id)" 0 #报表-转子跳动检查见证表
    export_table "rep_rotor_runout_list_daily" "pid IN ($rotor_runout_id)" 0

    djphsyjz_b_id="SELECT id FROM rep_djphsyjz_b_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_djphsyjz_b_daily" "id IN ($djphsyjz_b_id)" 0 #报表-动/静平衡试验见证表（泵）
    export_table "rep_djphsyjz_b_list_daily" "pid IN ($djphsyjz_b_id)" 0

    zzdphjcssyjz_id="SELECT id FROM rep_zzdphjcssyjz_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_zzdphjcssyjz_daily" "id IN ($zzdphjcssyjz_id)" 0 #报表-转子动平衡及超速试验见证表

    scjdtljcb_id="SELECT id FROM rep_scjdtljcb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_scjdtljcb_daily" "id IN ($scjdtljcb_id)" 0 #报表-剩磁及电跳量检查表
    export_table "rep_scjdtljcb_list_daily" "pid IN ($scjdtljcb_id)" 0

    ylcssyjzjl_id="SELECT id FROM rep_ylcssyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_ylcssyjzjl_daily" "id IN ($ylcssyjzjl_id)" 0 #报表-叶轮超速试验见证记录表
    export_table "rep_ylcssyjzjl_list_daily" "pid IN ($ylcssyjzjl_id)" 0

    incoming_casting_id="SELECT id FROM rep_incoming_casting_daily WHERE docid IN (${DOC_IDS})"
    incoming_casting_pid="SELECT id FROM rep_incoming_casting_list_daily WHERE pid IN ($incoming_casting_id)"
    export_table "rep_incoming_casting_daily" "id IN ($incoming_casting_id)" 0 #报表-铸件入厂检验见证记录表
    export_table "rep_incoming_casting_list_daily" "pid IN ($incoming_casting_id)" 0
    export_table "rep_incoming_casting_list_list_daily" "pid IN ($incoming_casting_pid)" 0

    incoming_profile_id="SELECT id FROM rep_incoming_profile_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_incoming_profile_daily" "id IN ($incoming_profile_id)" 0 #报表-型材入厂检验见证记录表0
    export_table "rep_incoming_profile_list_daily" "pid IN ($incoming_profile_id)" 0

    bxpzjcpjyjlb_id="SELECT id FROM rep_bxpzjcpjyjlb_daily WHERE docid IN (${DOC_IDS})"
    bxpzjcpjyjlb_pid="SELECT id FROM rep_bxpzjcpjyjlb_list_daily WHERE pid IN ($bxpzjcpjyjlb_id)"
    export_table "rep_bxpzjcpjyjlb_daily" "id IN ($bxpzjcpjyjlb_id)" 0 #报表-波形膨胀节（成品）检验记录表
    export_table "rep_bxpzjcpjyjlb_list_daily" "pid IN ($bxpzjcpjyjlb_id)" 0
    export_table "rep_bxpzjcpjyjlb_list_list_daily" "pid IN ($bxpzjcpjyjlb_pid)" 0

    gsbcpjyjzjlb_id="SELECT id FROM rep_gsbcpjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    gsbcpjyjzjlb_pid="SELECT id FROM rep_gsbcpjyjzjlb_list_daily WHERE pid IN ($gsbcpjyjzjlb_id)"
    export_table "rep_gsbcpjyjzjlb_daily" "id IN ($gsbcpjyjzjlb_id)" 0 #报表-格栅板（成品）检验记录表
    export_table "rep_gsbcpjyjzjlb_list_daily" "pid IN ($gsbcpjyjzjlb_id)" 0
    export_table "rep_gsbcpjyjzjlb_list_list_daily" "pid IN ($gsbcpjyjzjlb_pid)" 0

    cpgcpjyjzjlb_id="SELECT id FROM rep_cpgcpjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    cpgcpjyjzjlb_pid="SELECT id FROM rep_cpgcpjyjzjlb_list_daily WHERE pid IN ($cpgcpjyjzjlb_id)"
    export_table "rep_cpgcpjyjzjlb_daily" "id IN ($cpgcpjyjzjlb_id)" 0 #报表-翅片管（成品）检验见证记录表
    export_table "rep_cpgcpjyjzjlb_list_daily" "pid IN ($cpgcpjyjzjlb_id)" 0
    export_table "rep_cpgcpjyjzjlb_list_list_daily" "pid IN ($cpgcpjyjzjlb_pid)" 0

    bpjyjzjlb_id="SELECT id FROM rep_bpjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    bpjyjzjlb_pid="SELECT id FROM rep_bpjyjzjlb_daily WHERE pid IN ($bpjyjzjlb_id)"
    export_table "rep_bpjyjzjlb_daily" "id IN ($bpjyjzjlb_id)" 0 #报表-板片检验见证记录表
    export_table "rep_bpjyjzjlb_list_daily" "pid IN ($bpjyjzjlb_id)" 0
    export_table "rep_bpjyjzjlb_list_list_daily" "pid IN ($bpjyjzjlb_pid)" 0

    dygjyjzjlb_id="SELECT id FROM rep_dygjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    dygjyjzjlb_pid="SELECT id FROM rep_dygjyjzjlb_list_daily WHERE pid IN ($dygjyjzjlb_id)"
    export_table "rep_dygjyjzjlb_daily" "id IN ($dygjyjzjlb_id)" 0 #报表-单元管检验见证记录表
    export_table "rep_dygjyjzjlb_list_daily" "pid IN ($dygjyjzjlb_id)" 0
    export_table "rep_dygjyjzjlb_list_list_daily" "pid IN ($dygjyjzjlb_pid)" 0

    fpcxjyjzjlb_id="SELECT id FROM rep_dygjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    fpcxjyjzjlb_pid="SELECT id FROM rep_fpcxjyjzjlb_list_daily WHERE pid IN ($fpcxjyjzjlb_id)"
    export_table "rep_dygjyjzjlb_daily" "id IN ($fpcxjyjzjlb_id)" 0 #报表-分片成型检验见证记录表
    export_table "rep_fpcxjyjzjlb_list_daily" "pid IN ($fpcxjyjzjlb_id)" 0
    export_table "rep_fpcxjyjzjlb_list_list_daily" "pid IN ($fpcxjyjzjlb_pid)" 0

    fpcxjyjzjlb_id="SELECT id FROM rep_fpzzjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    fpcxjyjzjlb_pid="SELECT id FROM rep_fpzzjyjzjlb_list WHERE pid IN ($fpcxjyjzjlb_id)"
    export_table "rep_fpzzjyjzjlb_daily" "id IN ($fpcxjyjzjlb_id)" 0 #报表-分片组装检验见证记录表
    export_table "rep_fpzzjyjzjlb_list_daily" "pid IN ($fpcxjyjzjlb_id)" 0
    export_table "rep_fpzzjyjzjlb_list_list_daily" "pid IN ($fpcxjyjzjlb_pid)" 0

    pgjyjzjlb_id="SELECT id FROM rep_pgjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    pgjyjzjlb_pid="SELECT id FROM rep_pgjyjzjlb_list_daily WHERE pid IN ($pgjyjzjlb_id)"
    export_table "rep_pgjyjzjlb_daily" "id IN ($pgjyjzjlb_id)" 0 #报表-盘管检验见证记录表
    export_table "rep_pgjyjzjlb_list_daily" "pid IN ($pgjyjzjlb_id)" 0
    export_table "rep_pgjyjzjlb_list_list_daily" "pid IN ($pgjyjzjlb_pid)" 0

    lxjzgjyjzjl_id="SELECT id FROM rep_lxjzgjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    lxjzgjyjzjl_pid="SELECT id FROM rep_lxjzgjyjzjl_list_daily WHERE pid IN ($lxjzgjyjzjl_id)"
    export_table "rep_lxjzgjyjzjl_daily" "id IN ($lxjzgjyjzjl_id)" 0 #报表-离心浇铸管检验见证记录表
    export_table "rep_lxjzgjyjzjl_list_daily" "pid IN ($lxjzgjyjzjl_id)" 0
    export_table "rep_lxjzgjyjzjl_list_list_daily" "pid IN ($lxjzgjyjzjl_pid)" 0

    zxtssjjyjzjl_id="SELECT id FROM rep_zxtssjjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    zxtssjjyjzjl_pid="SELECT id FROM rep_zxtssjjyjzjl_list_daily WHERE pid IN ($zxtssjjyjzjl_id)"
    export_table "rep_zxtssjjyjzjl_daily" "id IN ($zxtssjjyjzjl_id)" 0 #报表-中心筒/伸缩节检验见证记录表
    export_table "rep_zxtssjjyjzjl_list_daily" "pid IN ($zxtssjjyjzjl_id)" 0
    export_table "rep_zxtssjjyjzjl_list_list_daily" "pid IN ($zxtssjjyjzjl_pid)" 0

    zzypcpjyjzjl_id="SELECT id FROM rep_zzypcpjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    zzypcpjyjzjl_pid="SELECT id FROM rep_zzypcpjyjzjl_list_daily WHERE pid IN ($zzypcpjyjzjl_id)"
    export_table "rep_zzypcpjyjzjl_daily" "id IN ($zzypcpjyjzjl_id)" 0 #报表-主轴/圆盘（成品）检验见证记录表
    export_table "rep_zzypcpjyjzjl_list_daily" "pid IN ($zzypcpjyjzjl_id)" 0
    export_table "rep_zzypcpjyjzjl_list_list_daily" "pid IN ($zzypcpjyjzjl_pid)" 0

    fsddpjyjzjl_id="SELECT id FROM rep_fsddpjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_fsddpjyjzjl_daily" "id IN ($fsddpjyjzjl_id)" 0 #报表-辐射段单片检验见证记录表
    export_table "rep_fsddpjyjzjl_list_daily" "pid IN ($fsddpjyjzjl_id)" 0

    fsdyzzjyjzjl_id="SELECT id FROM rep_fsdyzzjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_fsdyzzjyjzjl_daily" "id IN ($fsdyzzjyjzjl_id)" 0 #报表-辐射段预组装检验见证记录表
    export_table "rep_fsdyzzjyjzjl_list_daily" "pid IN ($fsdyzzjyjzjl_id)" 0

    dldmkjyjzjl_id="SELECT id FROM rep_dldmkjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_dldmkjyjzjl_daily" "id IN ($dldmkjyjzjl_id)" 0 #报表-对流段模块检验见证记录表
    export_table "rep_dldmkjyjzjl_list_daily" "pid IN ($dldmkjyjzjl_id)" 0

    dldyzzjyjzjl_id="SELECT id FROM rep_dldyzzjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_dldyzzjyjzjl_daily" "id IN ($dldyzzjyjzjl_id)" 0 #报表-对流段预组装检验见证记录表
    export_table "rep_dldyzzjyjzjl_list_daily" "pid IN ($dldyzzjyjzjl_id)" 0

    ydycfdjyjzjl_id="SELECT id FROM rep_ydycfdjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_ydycfdjyjzjl_daily" "id IN ($ydycfdjyjzjl_id)" 0 #报表-烟道/烟囱分段检验见证记录表
    export_table "rep_ydycfdjyjzjl_list_daily" "pid IN ($ydycfdjyjzjl_id)" 0

    zcljcjl_id="SELECT id FROM rep_zcljcjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_zcljcjl_daily" "id IN ($zcljcjl_id)" 0 #报表-砖衬里检查记录表
    export_table "rep_zcljcjl_list_daily" "pid IN ($zcljcjl_id)" 0

    tcqwlcljcjl_id="SELECT id FROM rep_tcqwlcljcjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_tcqwlcljcjl_daily" "id IN ($tcqwlcljcjl_id)" 0 #报表-陶瓷纤维类衬里检查记录表
    export_table "rep_tcqwlcljcjl_list_daily" "pid IN ($tcqwlcljcjl_id)" 0

    zxjyjzjl_id="SELECT id FROM rep_zxjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    zxjyjzjl_pid="SELECT id FROM rep_zxjyjzjl_list_daily WHERE pid IN ($zxjyjzjl_id)"
    export_table "rep_zxjyjzjl_daily" "id IN ($zxjyjzjl_id)" 0 #报表-轴系检验见证记录表
    export_table "rep_zxjyjzjl_list_daily" "pid IN ($zxjyjzjl_id)" 0
    export_table "rep_zxjyjzjl_list_list_daily" "pid IN ($zxjyjzjl_pid)" 0

    zfzzjyjzjl_id="SELECT id FROM rep_zfzzjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    zfzzjyjzjl_pid="SELECT id FROM rep_zfzzjyjzjl_list_daily WHERE pid IN ($zfzzjyjzjl_id)"
    export_table "rep_zfzzjyjzjl_daily" "id IN ($zfzzjyjzjl_id)" 0 #报表-轴封组装检验见证记录表
    export_table "rep_zfzzjyjzjl_list_daily" "pid IN ($zfzzjyjzjl_id)" 0
    export_table "rep_zfzzjyjzjl_list_list_daily" "pid IN ($zfzzjyjzjl_pid)" 0

    rgtjyjzjl_id="SELECT id FROM rep_rgtjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    rgtjyjzjl_pid="SELECT id FROM rep_rgtjyjzjl_list_daily WHERE pid IN ($rgtjyjzjl_id)"
    export_table "rep_rgtjyjzjl_daily" "id IN ($rgtjyjzjl_id)" 0 #报表-绕管体检验见证记录表
    export_table "rep_rgtjyjzjl_list_daily" "pid IN ($rgtjyjzjl_id)" 0
    export_table "rep_rgtjyjzjl_list_list_daily" "pid IN ($rgtjyjzjl_pid)" 0

    jxlxjyjzjl_id="SELECT id FROM rep_jxlxjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    jxlxjyjzjl_pid="SELECT id FROM rep_jxlxjyjzjl_list_daily WHERE pid IN ($jxlxjyjzjl_id)"
    export_table "rep_jxlxjyjzjl_daily" "id IN ($jxlxjyjzjl_id)" 0 #报表-集箱/联箱检验见证记录表
    export_table "rep_jxlxjyjzjl_list_daily" "pid IN ($jxlxjyjzjl_id)" 0
    export_table "rep_jxlxjyjzjl_list_list_daily" "pid IN ($jxlxjyjzjl_pid)" 0

    fdsbzzjyjzjl_id="SELECT id FROM rep_fdsbzzjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    fdsbzzjyjzjl_pid="SELECT id FROM rep_fdsbzzjyjzjl_list_daily WHERE pid IN ($fdsbzzjyjzjl_id)"
    export_table "rep_fdsbzzjyjzjl_daily" "id IN ($fdsbzzjyjzjl_id)" 0 #报表-分段设备组装检验见证记录表
    export_table "rep_fdsbzzjyjzjl_list_daily" "pid IN ($fdsbzzjyjzjl_id)" 0
    export_table "rep_fdsbzzjyjzjl_list_list_daily" "pid IN ($fdsbzzjyjzjl_pid)" 0

    jtzlzjzzzzjy_id="SELECT id FROM rep_jtzlzjzzzzjy_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_jtzlzjzzzzjy_daily" "id IN ($jtzlzjzzzzjy_id)" 0 #报表-夹套支梁座及支座组装检验见证记录表
    export_table "rep_jtzlzjzzzzjy_list_daily" "pid IN ($jtzlzjzzzzjy_id)" 0

    mbjyjzjl_id="SELECT id FROM rep_mbjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    mbjyjzjl_pid="SELECT id FROM rep_mbjyjzjl_list_daily WHERE pid IN ($mbjyjzjl_id)"
    export_table "rep_mbjyjzjl_daily" "id IN ($mbjyjzjl_id)" 0 #报表-面板检验见证记录表
    export_table "rep_mbjyjzjl_list_daily" "pid IN ($mbjyjzjl_id)" 0
    export_table "rep_mbjyjzjl_list_list_daily" "pid IN ($mbjyjzjl_pid)" 0

    mbjyjzjl_id="SELECT id FROM rep_qkbzzjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_qkbzzjyjzjl_daily" "id IN ($mbjyjzjl_id)" 0 #报表-球壳板组装检验见证记录表
    export_table "rep_qkbzzjyjzjl_list_daily" "pid IN ($mbjyjzjl_id)" 0

    qgzzjyjz_id="SELECT id FROM rep_qgzzjyjz_daily WHERE docid IN (${DOC_IDS})"
    qgzzjyjz_pid="SELECT id FROM rep_qgzzjyjz_list_daily WHERE id IN ($qgzzjyjz_id)"
    export_table "rep_qgzzjyjz_daily" "id IN ($qgzzjyjz_id)" 0 #报表-球罐支柱检验见证记录表
    export_table "rep_qgzzjyjz_list_daily" "pid IN ($qgzzjyjz_id)" 0
    export_table "rep_qgzzjyjz_list_list_daily" "pid IN ($qgzzjyjz_pid)" 0

    zzjyjzjl_id="SELECT id FROM rep_zzjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    zzjyjzjl_pid="SELECT id FROM rep_zzjyjzjl_list_daily WHERE pid IN ($zzjyjzjl_id)"
    export_table "rep_zzjyjzjl_daily" "id IN ($zzjyjzjl_id)" 0 #报表-组装检验见证记录表
    export_table "rep_zzjyjzjl_list_daily" "pid IN ($zzjyjzjl_id)" 0
    export_table "rep_zzjyjzjl_list_list_daily" "pid IN ($zzjyjzjl_pid)" 0

    qgrcl_id="SELECT zid FROM rep_qgrcl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_qgrcl_daily" "zid IN ($qgrcl_id)" 0 #报表-球罐热处理检验记录表
    export_table "rep_qgrcl_list_daily" "pid IN ($qgrcl_id)" 0

    ztyzzjcjzjl_id="SELECT id FROM rep_ztyzzjcjzjl_daily WHERE docid IN (${DOC_IDS})"
    ztyzzjcjzjl_pid="SELECT id FROM rep_ztyzzjcjzjl_list_daily WHERE pid IN ($ztyzzjcjzjl_id)"
    export_table "rep_ztyzzjcjzjl_daily" "id IN ($ztyzzjcjzjl_id)" 0 #报表-整体预组装检查见证记录表
    export_table "rep_ztyzzjcjzjl_list_daily" "pid IN ($ztyzzjcjzjl_id)" 0
    export_table "rep_ztyzzjcjzjl_list_list_daily" "pid IN ($ztyzzjcjzjl_pid)" 0

    zongzjyjzjl_id="SELECT id FROM rep_zongzjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    zongzjyjzjl_pid="SELECT id FROM rep_zongzjyjzjl_list_daily WHERE pid IN ($zongzjyjzjl_id)"
    export_table "rep_zongzjyjzjl_daily" "id IN ($zongzjyjzjl_id)" 0 #报表-总装检验见证记录表
    export_table "rep_zongzjyjzjl_list_daily" "pid IN ($zongzjyjzjl_id)" 0
    export_table "rep_zongzjyjzjl_list_list_daily" "pid IN ($zongzjyjzjl_pid)" 0

    ltrtzk_id="SELECT zid FROM rep_ltrtzk_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_ltrtzk_daily" "zid IN ($ltrtzk_id)" 0 #报表-冷态/热态真空试验见证记录表
    export_table "rep_ltrtzk_list_daily" "pid IN ($ltrtzk_id)" 0

    rtsyjz_id="SELECT zid FROM rep_rtsyjz_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_rtsyjz_daily" "zid IN ($rtsyjz_id)" 0 #报表-热态试验见证记录表
    export_table "rep_rtsyjz_list_daily" "pid IN ($rtsyjz_id)" 0

    rep_qgnysy_id="SELECT zid FROM rep_qgnysy_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_qgnysy_daily" "zid IN ($rep_qgnysy_id)" 0 #报表-球罐耐压试验见证记录表
    export_table "rep_qgnysy_list1_daily" "pid IN ($rep_qgnysy_id)" 0
    export_table "rep_qgnysy_list2_daily" "pid IN ($rep_qgnysy_id)" 0
    export_table "rep_qgnysy_list3_daily" "pid IN ($rep_qgnysy_id)" 0

    jbzzyzzjkzscjcjz_id="SELECT id FROM rep_jbzzyzzjkzscjcjz_daily WHERE docid IN (${DOC_IDS})"
    jbzzyzzjkzscjcjz_pid="SELECT id FROM rep_jbzzyzzjkzscjcjz_list_daily WHERE pid IN ($jbzzyzzjkzscjcjz_id)"
    export_table "rep_jbzzyzzjkzscjcjz_daily" "id IN ($jbzzyzzjkzscjcjz_id)" 0 #报表-搅拌装置预组装及空载试车检查见证表
    export_table "rep_jbzzyzzjkzscjcjz_list_daily" "pid IN ($jbzzyzzjkzscjcjz_id)" 0
    export_table "rep_jbzzyzzjkzscjcjz_list_list_daily" "pid IN ($jbzzyzzjkzscjcjz_pid)" 0

    pgjyjzjl_id="SELECT id FROM rep_pgjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    pgjyjzjl_pid="SELECT id FROM rep_pgjyjzjl_list_daily WHERE pid IN ($pgjyjzjl_id)"
    export_table "rep_pgjyjzjl_daily" "id IN ($pgjyjzjl_id)" 0 #报表-抛光检验见证记录表
    export_table "rep_pgjyjzjl_list_daily" "pid IN ($pgjyjzjl_id)" 0
    export_table "rep_pgjyjzjl_list_list_daily" "pid IN ($pgjyjzjl_pid)" 0

    psptjcjzjl_id="SELECT id FROM rep_psptjcjzjl_daily WHERE docid IN (${DOC_IDS})"
    psptjcjzjl_pid="SELECT id FROM rep_psptjcjzjl_list_daily WHERE pid IN ($psptjcjzjl_id)"
    export_table "rep_psptjcjzjl_daily" "id IN ($psptjcjzjl_id)" 0 #报表-喷砂、喷涂检查见证记录表
    export_table "rep_psptjcjzjl_list_daily" "pid IN ($psptjcjzjl_id)" 0
    export_table "rep_psptjcjzjl_list_list_daily" "pid IN ($psptjcjzjl_pid)" 0

    jgjrcjyjzjlb_id="SELECT id FROM rep_jgjrcjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    jgjrcjyjzjlb_pid="SELECT id FROM rep_jgjrcjyjzjlb_list_daily WHERE pid IN ($jgjrcjyjzjlb_id)"
    export_table "rep_jgjrcjyjzjlb_daily" "id IN ($jgjrcjyjzjlb_id)" 0 #报表-紧固件入厂检验见证记录表
    export_table "rep_jgjrcjyjzjlb_list_daily" "pid IN ($jgjrcjyjzjlb_id)" 0
    export_table "rep_jgjrcjyjzjlb_list_list_daily" "pid IN ($jgjrcjyjzjlb_pid)" 0

    ftyzjyjzjlb_id="SELECT id FROM rep_ftyzjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    ftyzjyjzjlb_pid="SELECT id FROM rep_ftyzjyjzjlb_list_daily WHERE pid IN ($ftyzjyjzjlb_id)"
    export_table "rep_ftyzjyjzjlb_daily" "id IN ($ftyzjyjzjlb_id)" 0 #报表-封头压制检验见证记录表
    export_table "rep_ftyzjyjzjlb_list_daily" "pid IN ($ftyzjyjzjlb_id)" 0
    export_table "rep_ftyzjyjzjlb_list_list_daily" "pid IN ($ftyzjyjzjlb_pid)" 0

    tjjjgjyjzjl_id="SELECT id FROM rep_tjjjgjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    tjjjgjyjzjl_pid="SELECT id FROM rep_tjjjgjyjzjl_list_daily WHERE pid IN ($tjjjgjyjzjl_id)"
    export_table "rep_tjjjgjyjzjl_daily" "id IN ($tjjjgjyjzjl_id)" 0 #报表-筒节机加工检验见证记录表
    export_table "rep_tjjjgjyjzjl_list_daily" "pid IN ($tjjjgjyjzjl_id)"
    export_table "rep_tjjjgjyjzjl_list_list_daily" "pid IN ($tjjjgjyjzjl_pid)" 0

    ttjjgjyjzjl_id="SELECT id FROM rep_ttjjgjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    ttjjgjyjzjl_pid="SELECT id FROM rep_ttjjgjyjzjl_list_daily WHERE pid IN ($ttjjgjyjzjl_id)"
    export_table "rep_ttjjgjyjzjl_daily" "id IN ($ttjjgjyjzjl_id)" 0 #报表-凸台机加工检验见证记录表
    export_table "rep_ttjjgjyjzjl_list_daily" "pid IN ($ttjjgjyjzjl_id)" 0
    export_table "rep_ttjjgjyjzjl_list_list_daily" "pid IN ($ttjjgjyjzjl_pid)" 0

    ysdjyjzjl_id="SELECT id FROM rep_ysdjyjzjl_daily WHERE docid IN (${DOC_IDS})"
    ysdjyjzjl_pid="SELECT id FROM rep_ysdjyjzjl_list_daily WHERE id IN ($ysdjyjzjl_id)"
    export_table "rep_ysdjyjzjl_daily" "id IN ($ysdjyjzjl_id)" 0 #报表-压缩堵检验见证记录表
    export_table "rep_ysdjyjzjl_list_daily" "pid IN ($ysdjyjzjl_id)" 0
    export_table "rep_ysdjyjzjl_list_list_daily" "pid IN ($ysdjyjzjl_pid)" 0

    gxjyjzjlb_id="SELECT id FROM rep_gxjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    gxjyjzjlb_pid="SELECT id FROM rep_gxjyjzjlb_list_daily WHERE id IN ($gxjyjzjlb_id)"
    export_table "rep_gxjyjzjlb_daily" "id IN ($gxjyjzjlb_id)" 0 #报表-管箱检验见证记录表
    export_table "rep_gxjyjzjlb_list_daily" "pid IN ($gxjyjzjlb_id)" 0
    export_table "rep_gxjyjzjlb_list_list_daily" "pid IN ($gxjyjzjlb_pid)" 0

    byccpjyjzjlb_id="SELECT id FROM rep_byccpjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    byccpjyjzjlb_pid="SELECT id FROM rep_byccpjyjzjlb_list_daily WHERE pid IN ($byccpjyjzjlb_id)"
    export_table "rep_byccpjyjzjlb_daily" "id IN ($byccpjyjzjlb_id)" 0 #报表-百叶窗产品检验见证记录表
    export_table "rep_byccpjyjzjlb_list_daily" "pid IN ($byccpjyjzjlb_id)" 0
    export_table "rep_byccpjyjzjlb_list_list_daily" "pid IN ($byccpjyjzjlb_pid)" 0

    jgcpjyjzjlb_id="SELECT id FROM rep_jgcpjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    jgcpjyjzjlb_pid="SELECT id FROM rep_jgcpjyjzjlb_list_daily WHERE pid IN ($jgcpjyjzjlb_id)"
    export_table "rep_jgcpjyjzjlb_daily" "id IN ($jgcpjyjzjlb_id)" 0 #报表-构架产品检验见证记录表
    export_table "rep_jgcpjyjzjlb_list_daily" "pid IN ($jgcpjyjzjlb_id)" 0
    export_table "rep_jgcpjyjzjlb_list_list_daily" "pid IN ($jgcpjyjzjlb_pid)" 0

    fjjyjzjlb_id="SELECT id FROM rep_fjjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    fjjyjzjlb_pid="SELECT id FROM rep_fjjyjzjlb_list_daily WHERE pid IN ($fjjyjzjlb_id)"
    export_table "rep_fjjyjzjlb_daily" "id IN ($fjjyjzjlb_id)" 0 #报表-风机检验见证记录表
    export_table "rep_fjjyjzjlb_list_daily" "pid IN ($fjjyjzjlb_id)" 0
    export_table "rep_fjjyjzjlb_list_list_daily" "pid IN ($fjjyjzjlb_pid)" 0

    txthljyjl_id="SELECT id FROM rep_txthljyjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_txthljyjl_daily" "id IN ($txthljyjl_id)" 0 #报表-铁素体含量检验记录表
    export_table "rep_txthljyjl_list_daily" "documentid IN ($txthljyjl_id)" 0

    jrgjyjlb_id="SELECT id FROM rep_jrgjyjlb_daily WHERE docid IN (${DOC_IDS})"
    jrgjyjlb_pid="SELECT id FROM rep_jrgjyjlb_list_daily WHERE pid IN ($jrgjyjlb_id)"
    export_table "rep_jrgjyjlb_daily" "id IN ($jrgjyjlb_id)" 0 #报表-加热管检验记录表
    export_table "rep_jrgjyjlb_list_daily" "pid IN ($jrgjyjlb_id)" 0
    export_table "rep_jrgjyjlb_list_list_daily" "pid IN ($jrgjyjlb_pid)" 0

    dhchdjyjl_id="SELECT id FROM rep_dhchdjyjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_dhchdjyjl_daily" "id IN ($dhchdjyjl_id)" 0 #报表-堆焊层厚度检验记录表
    export_table "rep_dhchdjyjl_list_daily" "documentid IN ($dhchdjyjl_id)" 0

    sxgfyjyjlb_id="SELECT id FROM rep_sxgfyjyjlb_daily WHERE docid IN (${DOC_IDS})"
    sxgfyjyjlb_pid="SELECT id FROM rep_sxgfyjyjlb_list_daily WHERE pid IN ($sxgfyjyjlb_id)"
    export_table "rep_sxgfyjyjlb_daily" "id IN ($sxgfyjyjlb_id)" 0 #报表-蛇形管放样检验记录表
    export_table "rep_sxgfyjyjlb_list_daily" "pid IN ($sxgfyjyjlb_id)" 0
    export_table "rep_sxgfyjyjlb_list_list_daily" "pid IN ($sxgfyjyjlb_pid)" 0

    sxgccwgjyjlb_id="SELECT id FROM rep_sxgccwgjyjlb_daily WHERE docid IN (${DOC_IDS})"
    sxgccwgjyjlb_pid="SELECT id FROM rep_sxgccwgjyjlb_list_daily WHERE pid IN ($sxgccwgjyjlb_id)"
    export_table "rep_sxgccwgjyjlb_daily" "id IN ($sxgccwgjyjlb_id)" 0 #报表-蛇形管尺寸外观检验记录表
    export_table "rep_sxgccwgjyjlb_list_daily" "pid IN ($sxgccwgjyjlb_id)" 0
    export_table "rep_sxgccwgjyjlb_list_list_daily" "pid IN ($sxgccwgjyjlb_pid)" 0

    wgccwgjyjl_id="SELECT id FROM rep_wgccwgjyjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_wgccwgjyjl_daily" "id IN ($wgccwgjyjl_id)" 0 #报表-弯管尺寸外观检验记录表
    export_table "rep_wgccwgjyjl_list_daily" "pid IN ($wgccwgjyjl_id)" 0

    sxgjgptqsyjzjl_id="SELECT id FROM rep_sxgjgptqsyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_sxgjgptqsyjzjl_daily" "id IN ($sxgjgptqsyjzjl_id)" 0 #报表-蛇形管及管屏通球试验见证记录表
    export_table "rep_sxgjgptqsyjzjl_list_daily" "pid IN ($sxgjgptqsyjzjl_id)" 0

    sxgjgpnyjzjl_id="SELECT id FROM rep_sxgjgpnyjzjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_sxgjgpnyjzjl_daily" "id IN ($sxgjgpnyjzjl_id)" 0 #报表-蛇形管及管屏耐压见证记录表
    export_table "rep_sxgjgpnyjzjl_list_daily" "pid IN ($sxgjgpnyjzjl_id)" 0

    gjglzccwgjyjlb_id="SELECT id FROM rep_gjglzccwgjyjlb_daily WHERE docid IN (${DOC_IDS})"
    gjglzccwgjyjlb_pid="SELECT id FROM rep_gjglzccwgjyjlb_list_daily WHERE pid IN ($gjglzccwgjyjlb_id)"
    export_table "rep_gjglzccwgjyjlb_daily" "id IN ($gjglzccwgjyjlb_id)" 0 #报表-钢结构（立柱）尺寸外观检验记录表
    export_table "rep_gjglzccwgjyjlb_list_daily" "pid IN ($gjglzccwgjyjlb_id)" 0
    export_table "rep_gjglzccwgjyjlb_list_list_daily" "pid IN ($gjglzccwgjyjlb_pid)" 0

    gjgdblccwgjyjlb_id="SELECT id FROM rep_gjgdblccwgjyjlb_daily WHERE docid IN (${DOC_IDS})"
    gjgdblccwgjyjlb_pid="SELECT id FROM rep_gjgdblccwgjyjlb_list_daily WHERE pid IN ($gjgdblccwgjyjlb_id)"
    export_table "rep_gjgdblccwgjyjlb_daily" "id IN ($gjgdblccwgjyjlb_id)" 0 #报表-钢结构（大板梁）尺寸外观检验记录表
    export_table "rep_gjgdblccwgjyjlb_list_daily" "pid IN ($gjgdblccwgjyjlb_id)" 0
    export_table "rep_gjgdblccwgjyjlb_list_list_daily" "pid IN ($gjgdblccwgjyjlb_pid)" 0

    mkkjccwgjyjlb_id="SELECT id FROM rep_mkkjccwgjyjlb_daily WHERE docid IN (${DOC_IDS})"
    mkkjccwgjyjlb_pid="SELECT id FROM rep_mkkjccwgjyjlb_list_daily WHERE pid IN ($mkkjccwgjyjlb_id)"
    export_table "rep_mkkjccwgjyjlb_daily" "id IN ($mkkjccwgjyjlb_id)" 0 #报表-模块框架尺寸外观检验记录表
    export_table "rep_mkkjccwgjyjlb_list_daily" "pid IN ($mkkjccwgjyjlb_id)" 0
    export_table "rep_mkkjccwgjyjlb_list_list_daily" "pid IN ($mkkjccwgjyjlb_pid)" 0

    clhljyjlb_id="SELECT id FROM rep_clhljyjlb_daily WHERE docid IN (${DOC_IDS})"
    clhljyjlb_pid="SELECT id FROM rep_clhljyjlb_list_daily WHERE pid IN ($clhljyjlb_id)"
    export_table "rep_clhljyjlb_daily" "id IN ($clhljyjlb_id)" 0 #报表-衬里烘炉检验记录表
    export_table "rep_clhljyjlb_list_daily" "pid IN ($clhljyjlb_id)" 0
    export_table "rep_clhljyjlb_list_list_daily" "pid IN ($clhljyjlb_pid)" 0

    cljzjyjlb_id="SELECT id FROM rep_cljzjyjlb_daily WHERE docid IN (${DOC_IDS})"
    cljzjyjlb_pid="SELECT id FROM rep_cljzjyjlb_list_daily WHERE pid IN ($cljzjyjlb_id)"
    export_table "rep_cljzjyjlb_daily" "id IN ($cljzjyjlb_id)" 0 #报表-衬里浇注检验记录表
    export_table "rep_cljzjyjlb_list_daily" "pid IN ($cljzjyjlb_id)" 0
    export_table "rep_cljzjyjlb_list_list_daily" "pid IN ($cljzjyjlb_pid)" 0

    bzhbpbjjyjlba_id="SELECT id FROM rep_bzhbpbjjyjlba_daily WHERE docid IN (${DOC_IDS})"
    bzhbpbjjyjlba_pid="SELECT id FROM rep_bzhbpbjjyjlba_list_daily WHERE pid IN ($bzhbpbjjyjlba_id)"
    export_table "rep_bzhbpbjjyjlba_daily" "id IN ($bzhbpbjjyjlba_id)" 0 #报表-包装和备品备件检验记录表a
    export_table "rep_bzhbpbjjyjlba_list_daily" "pid IN ($bzhbpbjjyjlba_id)" 0
    export_table "rep_bzhbpbjjyjlba_list_list_daily" "pid IN ($bzhbpbjjyjlba_pid)" 0

    bzjjgjyjzb_id="SELECT id FROM rep_bzjjgjyjzb_daily WHERE docid IN (${DOC_IDS})"
    bzjjgjyjzb_pid="SELECT id FROM rep_bzjjgjyjzb_list_daily WHERE pid IN ($bzjjgjyjzb_id)"
    export_table "rep_bzjjgjyjzb_daily" "id IN ($bzjjgjyjzb_id)" 0 #报表-板材精加工检验见证记录表
    export_table "rep_bzjjgjyjzb_list_daily" "pid IN ($bzjjgjyjzb_id)" 0
    export_table "rep_bzjjgjyjzb_list_list_daily" "pid IN ($bzjjgjyjzb_pid)" 0

    ntyclrtjyjlb_id="SELECT id FROM rep_ntyclrtjyjlb_daily WHERE docid IN (${DOC_IDS})"
    ntyclrtjyjlb_pid="SELECT id FROM rep_ntyclrtjyjlb_list_daily WHERE pid IN ($ntyclrtjyjlb_id)"
    export_table "rep_ntyclrtjyjlb_daily" "id IN ($ntyclrtjyjlb_id)" 0 #报表-内筒与衬里热套检验见证记录表
    export_table "rep_ntyclrtjyjlb_list_daily" "pid IN ($ntyclrtjyjlb_id)" 0
    export_table "rep_ntyclrtjyjlb_list_list_daily" "pid IN ($ntyclrtjyjlb_pid)" 0

    hjgxjcjlb_id="SELECT id FROM rep_hjgxjcjlb_daily WHERE docid IN (${DOC_IDS})"
    hjgxjcjlb_pid="SELECT id FROM rep_hjgxjcjlb_list_daily WHERE pid IN ($hjgxjcjlb_id)"
    export_table "rep_hjgxjcjlb_daily" "id IN ($hjgxjcjlb_id)" 0 #报表-焊接工序检查记录表
    export_table "rep_hjgxjcjlb_list_daily" "pid IN ($hjgxjcjlb_id)" 0
    export_table "rep_hjgxjcjlb_list_list_daily" "pid IN ($hjgxjcjlb_pid)" 0

    sbjwjyjzjlb_id="SELECT id FROM rep_sbjwjyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    sbjwjyjzjlb_pid="SELECT id FROM rep_sbjwjyjzjlb_list_daily WHERE pid IN ($sbjwjyjzjlb_id)"
    export_table "rep_sbjwjyjzjlb_daily" "id IN ($sbjwjyjzjlb_id)" 0 #报表-设备就位检验见证记录表
    export_table "rep_sbjwjyjzjlb_list_daily" "pid IN ($sbjwjyjzjlb_id)" 0
    export_table "rep_sbjwjyjzjlb_list_list_daily" "pid IN ($sbjwjyjzjlb_pid)" 0

    kzxjyjl_id="SELECT id FROM rep_kzxjyjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_kzxjyjl_daily" "id IN ($kzxjyjl_id)" 0 #报表-控制箱检验记录表
    export_table "rep_kzxjyjl_list_daily" "pid IN ($kzxjyjl_id)"

    jxjyjl_id="SELECT id FROM rep_jxjyjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_jxjyjl_daily" "id IN ($jxjyjl_id)" 0 #报表-金相检验记录表
    export_table "rep_jxjyjl_list_daily" "documentid IN ($jxjyjl_id)" 0

    pmijyjl_id="SELECT id FROM rep_pmijyjl_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_pmijyjl_daily" "id IN ($pmijyjl_id)" 0 #报表-PMI检验记录表
    export_table "rep_pmijyjl_list_daily" "documentid IN ($pmijyjl_id)" 0

    rwdxsyjzb_id="SELECT id FROM rep_rwdxsyjzb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_rwdxsyjzb_daily" "id IN ($rwdxsyjzb_id)" 0 #报表-热稳定性试验见证记录表（汽轮机）
    export_table "rep_rwdxsyjzb_list_daily" "pid IN ($rwdxsyjzb_id)" 0

    jzlclsgqyjzjlb_id="SELECT id FROM rep_jzlclsgqyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_jzlclsgqyjzjlb_daily" "id IN ($jzlclsgqyjzjlb_id)" 0 #报表-浇筑料衬里施工前检验见证记录表
    export_table "rep_jzlclsgqyjzjlb_list_daily" "pid IN ($jzlclsgqyjzjlb_id)" 0

    jzlclsggcyjzjlb_id="SELECT id FROM rep_jzlclsggcyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_jzlclsggcyjzjlb_daily" "id IN ($jzlclsggcyjzjlb_id)" 0 #报表-浇筑料衬里施工过程检验见证记录表
    export_table "rep_jzlclsggcyjzjlb_list_daily" "pid IN ($jzlclsggcyjzjlb_id)" 0

    jzlclsghyjzjlb_id="SELECT id FROM rep_jzlclsghyjzjlb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_jzlclsghyjzjlb_daily" "id IN ($jzlclsghyjzjlb_id)" 0 #报表-浇筑料衬里施工后检验见证记录表
    export_table "rep_jzlclsghyjzjlb_list_daily" "pid IN ($jzlclsghyjzjlb_id)" 0

    rtjxyzsyjzb_id="SELECT id FROM rep_rtjxyzsyjzb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_rtjxyzsyjzb_daily" "id IN ($rtjxyzsyjzb_id)" 0 #报表-热态机械运转试验见证表（烟气轮机）
    export_table "rep_rtjxyzsyjzb_list_daily" "pid IN ($rtjxyzsyjzb_id)" 0
    export_table "rep_rtjxyzsyjzb_imglist_daily" "pid IN ($rtjxyzsyjzb_id)" 0

    cdjghqtsyjcjzb_id="SELECT id FROM rep_cdjghqtsyjcjzb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_cdjghqtsyjcjzb_daily" "id IN ($cdjghqtsyjcjzb_id)" 0 #报表-传动机构和其他试验检查见证表
    export_table "rep_cdjghqtsyjcjzb_list_daily" "pid IN ($cdjghqtsyjcjzb_id)" 0

    rep_ycllh_id="SELECT id FROM rep_ycllh_daily WHERE docid IN (${DOC_IDS})"
    rep_ycllh_pid="SELECT id FROM rep_ycllh_list_daily WHERE pid IN ($rep_ycllh_id)"
    export_table "rep_ycllh_daily" "id IN ($rep_ycllh_id)" 0 #报表-原材料理化检验记录表
    export_table "rep_ycllh_list_daily" "pid IN ($rep_ycllh_id)" 0
    export_table "rep_ycllh_list_list_daily" "pid IN ($rep_ycllh_pid)" 0

    rep_yzsygzj_id="SELECT id FROM rep_yzsygzj_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_yzsygzj_daily" "id IN ($rep_yzsygzj_id)" 0 #报表-运转试验见证表（干燥机）
    export_table "rep_yzsygzj_list1_daily" "pid IN ($rep_yzsygzj_id)" 0
    export_table "rep_yzsygzj_list2_daily" "pid IN ($rep_yzsygzj_id)" 0
    export_table "rep_yzsygzj_list3_daily" "pid IN ($rep_yzsygzj_id)" 0

    rep_sqcqzzxn_id="SELECT id FROM rep_sqcqzzxn_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_sqcqzzxn_daily" "id IN ($rep_sqcqzzxn_id)" 0 #报表-射汽抽汽装置性能试验见证表

    rep_jxyzsyjzb_id="SELECT id FROM rep_jxyzsyjzb_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_jxyzsyjzb_daily" "id IN ($rep_jxyzsyjzb_id)" 0 #报表-机械运转试验见证表

    rep_wfsysjsc_id="SELECT id FROM rep_wfsysjsc_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_wfsysjsc_daily" "id IN ($rep_wfsysjsc_id)" 0 #报表-往复式压缩机组试车见证表
    export_table "rep_wfsysjsc_list1_daily" "fid IN ($rep_wfsysjsc_id)" 0
    export_table "rep_wfsysjsc_list2_daily" "fid IN ($rep_wfsysjsc_id)" 0
    export_table "rep_wfsysjsc_list3_daily" "fid IN ($rep_wfsysjsc_id)" 0

    rep_wfsysj_id="SELECT id FROM rep_wfsysj_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_wfsysj_daily" "id IN ($rep_wfsysj_id)" 0 #报表-往复式压缩机组性能试验见证表
    export_table "rep_wfsysj_list1_daily" "fid IN ($rep_wfsysj_id)" 0
    export_table "rep_wfsysj_list2_daily" "fid IN ($rep_wfsysj_id)" 0
    export_table "rep_wfsysj_list3_daily" "fid IN ($rep_wfsysj_id)" 0

    rep_dxfdj_id="SELECT id FROM rep_dxfdj_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_dxfdj_daily" "id IN ($rep_dxfdj_id)" 0 #报表-整机试验见证表（电机）
    export_table "rep_dxfdj_list1_daily" "pid IN ($rep_dxfdj_id)" 0
    export_table "rep_dxfdj_list2_daily" "pid IN ($rep_dxfdj_id)" 0
    export_table "rep_dxfdj_list3_daily" "pid IN ($rep_dxfdj_id)" 0
    export_table "rep_dxfdj_list4_daily" "pid IN ($rep_dxfdj_id)" 0

    rep_lgysj_id="SELECT id FROM rep_lgysj_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_lgysj_daily" "id IN ($rep_lgysj_id)" 0 #报表-运转试验见证表（螺杆压缩机）
    export_table "rep_lgysj_list1_daily" "pid IN ($rep_lgysj_id)" 0
    export_table "rep_lgysj_list2_daily" "pid IN ($rep_lgysj_id)" 0
    export_table "rep_lgysj_list3_daily" "pid IN ($rep_lgysj_id)" 0
    export_table "rep_lgysj_list4_daily" "pid IN ($rep_lgysj_id)" 0

    rep_gcjyjz_id="SELECT id FROM rep_gcjyjz_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_gcjyjz_daily" "id IN ($rep_gcjyjz_id)" 0 #报表-过程检验见证记录表
    export_table "rep_gcjyjz_list_daily" "pid IN ($rep_gcjyjz_id)" 0

    rep_lxsy_id="SELECT id FROM rep_lxsy_daily WHERE docid IN (${DOC_IDS})"
    rep_lxsy_pid="SELECT id FROM rep_lxsy_list_daily WHERE pid IN ($rep_lxsy_id)"
    export_table "rep_lxsy_daily" "id IN ($rep_lxsy_id)" 0 #报表-例行试验见证表
    export_table "rep_lxsy_list_daily" "pid IN ($rep_lxsy_id)" 0
    export_table "rep_lxsy_list_list_daily" "pid IN ($rep_lxsy_pid)" 0

    rep_tssyjz_id="SELECT id FROM rep_tssyjz_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_tssyjz_daily" "id IN ($rep_tssyjz_id)" 0 #报表-特殊试验见证表（大型变压器）
    export_table "rep_tssyjz_list_daily" "pid IN ($rep_tssyjz_id)" 0

    rep_xssyjz_id="SELECT id FROM rep_xssyjz_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_xssyjz_daily" "id IN ($rep_xssyjz_id)" 0 #报表-型式试验见证表
    export_table "rep_xssyjz_list_daily" "pid IN ($rep_xssyjz_id)" 0

    rep_ccjyjz_id="SELECT id FROM rep_ccjyjz_daily WHERE docid IN (${DOC_IDS})"
    rep_ccjyjz_pid="SELECT id FROM rep_ccjyjz_list_daily WHERE pid IN ($rep_ccjyjz_id)"
    export_table "rep_ccjyjz_daily" "id IN ($rep_ccjyjz_id)" 0 #报表-出厂检验见证记录表
    export_table "rep_ccjyjz_list_daily" "pid IN ($rep_ccjyjz_id)" 0
    export_table "rep_ccjyjz_list_list_daily" "pid IN ($rep_ccjyjz_pid)" 0

    rep_hfhxcf_id="SELECT id FROM rep_hfhxcf_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_hfhxcf_daily" "id IN ($rep_hfhxcf_id)" 0 #报表-焊缝化学成分检验记录表
    export_table "rep_hfhxcf_list_daily" "pid IN ($rep_hfhxcf_id)" 0

    rep_hdchxcf_id="SELECT id FROM rep_hdchxcf_daily WHERE docid IN (${DOC_IDS})"
    export_table "rep_hdchxcf_daily" "id IN ($rep_hdchxcf_id)" 0 #报表-堆焊层化学成分检验记录表
    export_table "rep_hdchxcf_list_daily" "pid IN ($rep_hdchxcf_id)" 0

    rep_cpwgjcjlb_id="SELECT id FROM rep_cpwgjcjlb_daily WHERE docid IN (${DOC_IDS})"
    rep_cpwgjcjlb_pid="SELECT id FROM rep_cpwgjcjlb_list_daily WHERE pid IN ($rep_cpwgjcjlb_id)"
    export_table "rep_cpwgjcjlb_daily" "id IN ($rep_cpwgjcjlb_id)" 0 #报表-成品完工检查记录表
    export_table "rep_cpwgjcjlb_list_daily" "pid IN ($rep_cpwgjcjlb_id)" 0
    export_table "rep_cpwgjcjlb_list_list_daily" "pid IN ($rep_cpwgjcjlb_pid)" 0

    #统计报表-报表
    STATIC_EQUIPMENT_PARENT_ID="SELECT id FROM rep_raw_material_outsourcing_state_static_equipment where docid IN (${DOC_IDS})"
    export_table "rep_raw_material_outsourcing_state_static_equipment" "docid IN (${DOC_IDS})" 0     #报表-静设备-外协件外购件状态表-主表
    export_table "rep_raw_material_outsourcing_state_static_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-静设备-外协件外购件状态表-主表(历史)
    export_table "rep_raw_material_outsourcing_state_static_equipment_list" "pid IN ($STATIC_EQUIPMENT_PARENT_ID)" 0     #报表-静设备-外协件外购件状态表-明细表
    export_table "rep_raw_material_outsourcing_state_static_equipment_list_his" "pid IN ($STATIC_EQUIPMENT_PARENT_ID)" 0 #报表-静设备-外协件外购件状态表-明细表(历史)
    STATIC_BOARD_PARENT_ID="SELECT id FROM rep_raw_material_outsourcing_state_static_board where docid IN (${DOC_IDS})"
    export_table "rep_raw_material_outsourcing_state_static_board" "docid IN (${DOC_IDS})" 0     #报表-静设备-板材状态表-主表
    export_table "rep_raw_material_outsourcing_state_static_board_his" "docid IN (${DOC_IDS})" 0 #报表-静设备-板材状态表-主表(历史)
    export_table "rep_raw_material_outsourcing_state_static_board_list" "pid IN ($STATIC_BOARD_PARENT_ID)" 0     #报表-静设备-板材状态表-明细表
    export_table "rep_raw_material_outsourcing_state_static_board_list_his" "pid IN ($STATIC_BOARD_PARENT_ID)" 0 #报表-静设备-板材状态表-明细表(历史)
    STATIC_HET_PARENT_ID="SELECT id FROM rep_raw_material_outsourcing_state_static_het where docid IN (${DOC_IDS})"
    export_table "rep_raw_material_outsourcing_state_static_het" "docid IN (${DOC_IDS})" 0     #报表-静设备-换热管状态表-主表
    export_table "rep_raw_material_outsourcing_state_static_het_his" "docid IN (${DOC_IDS})" 0 #报表-静设备-换热管状态表-主表(历史)
    export_table "rep_raw_material_outsourcing_state_static_het_list" "pid IN ($STATIC_HET_PARENT_ID)" 0     #报表-静设备-换热管状态表-明细表
    export_table "rep_raw_material_outsourcing_state_static_het_list_his" "pid IN ($STATIC_HET_PARENT_ID)" 0 #报表-静设备-换热管状态表-明细表(历史)
    STATIC_FORGING_PARENT_ID="SELECT id FROM rep_raw_material_outsourcing_state_static_forging where docid IN (${DOC_IDS})"
    export_table "rep_raw_material_outsourcing_state_static_forging" "docid IN (${DOC_IDS})" 0     #报表-静设备-锻件状态表-主表
    export_table "rep_raw_material_outsourcing_state_static_forging_his" "docid IN (${DOC_IDS})" 0 #报表-静设备-锻件状态表-主表（历史）
    export_table "rep_raw_material_outsourcing_state_static_forging_list" "pid IN ($STATIC_FORGING_PARENT_ID)" 0     #报表-静设备-锻件状态表-明细表
    export_table "rep_raw_material_outsourcing_state_static_forging_list_his" "pid IN ($STATIC_FORGING_PARENT_ID)" 0 #报表-静设备-锻件状态表-明细表(历史)
    STATIC_WELD_PARENT_ID="SELECT id FROM rep_raw_material_outsourcing_state_static_weld where docid IN (${DOC_IDS})"
    export_table "rep_raw_material_outsourcing_state_static_weld" "docid IN (${DOC_IDS})" 0     #报表-静设备-焊材状态表-主表
    export_table "rep_raw_material_outsourcing_state_static_weld_his" "docid IN (${DOC_IDS})" 0 #报表-静设备-焊材状态表-主表(历史)
    export_table "rep_raw_material_outsourcing_state_static_weld_list" "pid IN ($STATIC_WELD_PARENT_ID)" 0     #报表-静设备-焊材状态表-明细表
    export_table "rep_raw_material_outsourcing_state_static_weld_list_his" "pid IN ($STATIC_WELD_PARENT_ID)" 0 #报表-静设备-焊材状态表-明细表(历史)
    export_table "rep_drawing_state_static_equipment" "docid IN (${DOC_IDS})" 0     #报表-静设备-图纸工艺文件状态表
    export_table "rep_drawing_state_static_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-静设备-图纸工艺文件状态表(历史)
    FM_PARENT_ID="SELECT id FROM rep_fm_wxwg_equipment_wxwg where docid IN (${DOC_IDS})"
    export_table "rep_fm_wxwg_equipment_wxwg" "docid IN (${DOC_IDS})" 0     #报表-阀门-外协件外购件状态表-主表
    export_table "rep_fm_wxwg_equipment_wxwg_his" "docid IN (${DOC_IDS})" 0 #报表-阀门-外协件外购件状态表-主表(历史)
    export_table "rep_fm_wxwg_equipment_wxwg_list" "pid IN ($FM_PARENT_ID)" 0     #报表-阀门-外协件外购件状态表-明细表
    export_table "rep_fm_wxwg_equipment_wxwg_list_his" "pid IN ($FM_PARENT_ID)" 0 #报表-阀门-外协件外购件状态表-明细表(历史)
    FM_BC_PARENT_ID="SELECT id FROM rep_fm_wxwg_equipment_bc where docid IN (${DOC_IDS})"
    export_table "rep_fm_wxwg_equipment_bc" "docid IN (${DOC_IDS})" 0     #报表-阀门-棒材状态表-主表
    export_table "rep_fm_wxwg_equipment_bc_his" "docid IN (${DOC_IDS})" 0 #报表-阀门-棒材状态表-主表(历史)
    export_table "rep_fm_wxwg_equipment_bc_list" "pid IN ($FM_BC_PARENT_ID)" 0     #报表-阀门-棒材状态表-明细表
    export_table "rep_fm_wxwg_equipment_bc_list_his" "pid IN ($FM_BC_PARENT_ID)" 0 #报表-阀门-棒材状态表-明细表(历史)
    FM_CJ_PARENT_ID="SELECT id FROM rep_fm_wxwg_equipment_cj where docid IN (${DOC_IDS})"
    export_table "rep_fm_wxwg_equipment_cj" "docid IN (${DOC_IDS})" 0     #报表-阀门-铸件状态表-主表
    export_table "rep_fm_wxwg_equipment_cj_his" "docid IN (${DOC_IDS})" 0 #报表-阀门-铸件状态表-主表(历史)
    export_table "rep_fm_wxwg_equipment_cj_list" "pid IN ($FM_CJ_PARENT_ID)" 0     #报表-阀门-铸件状态表-明细表
    export_table "rep_fm_wxwg_equipment_cj_list_his" "pid IN ($FM_CJ_PARENT_ID)" 0 #报表-阀门-铸件状态表-明细表(历史)
    FM_DJ_PARENT_ID="SELECT id FROM rep_fm_wxwg_equipment_dj where docid IN (${DOC_IDS})"
    export_table "rep_fm_wxwg_equipment_dj" "docid IN (${DOC_IDS})" 0     #报表-阀门-锻件状态表-主表
    export_table "rep_fm_wxwg_equipment_dj_his" "docid IN (${DOC_IDS})" 0 #报表-阀门-锻件状态表-主表(历史)
    export_table "rep_fm_wxwg_equipment_dj_list" "pid IN ($FM_DJ_PARENT_ID)" 0     #报表-阀门-锻件状态表-明细表
    export_table "rep_fm_wxwg_equipment_dj_list_his" "pid IN ($FM_DJ_PARENT_ID)" 0 #报表-阀门-锻件状态表-明细表(历史)
    export_table "rep_drawing_fm_equipment" "docid IN (${DOC_IDS})" 0     #报表-阀门-图纸工艺文件状态表
    export_table "rep_drawing_fm_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-阀门-图纸工艺文件状态表(历史)
    RAW_EQUIPMENT_PARENT_ID="SELECT id FROM rep_raw_material_outsourcing_state_rotating_equipment where docid IN (${DOC_IDS})"
    export_table "rep_raw_material_outsourcing_state_rotating_equipment" "docid IN (${DOC_IDS})" 0     #报表-转动设备-外协件外购件状态表-主表
    export_table "rep_raw_material_outsourcing_state_rotating_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-转动设备-外协件外购件状态表-主表(历史)
    export_table "rep_raw_material_outsourcing_state_rotating_equipment_list" "pid IN ($RAW_EQUIPMENT_PARENT_ID)" 0     #报表-转动设备-外协件外购件状态表-明细表
    export_table "rep_raw_material_outsourcing_state_rotating_equipment_list_his" "pid IN ($RAW_EQUIPMENT_PARENT_ID)" 0 #报表-转动设备-外协件外购件状态表-明细表(历史)
    RAW_MAINPARTS_PARENT_ID="SELECT id FROM rep_raw_material_outsourcing_state_rotating_mainparts where docid IN (${DOC_IDS})"
    export_table "rep_raw_material_outsourcing_state_rotating_mainparts" "docid IN (${DOC_IDS})" 0     #报表-转动设备-主要零部件状态表-主表
    export_table "rep_raw_material_outsourcing_state_rotating_mainparts_his" "docid IN (${DOC_IDS})" 0 #报表-转动设备-主要零部件状态表-主表(历史)
    export_table "rep_raw_material_outsourcing_state_rotating_mainparts_list" "pid IN ($RAW_MAINPARTS_PARENT_ID)" 0     #报表-转动设备-主要零部件状态表-明细表
    export_table "rep_raw_material_outsourcing_state_rotating_mainparts_list_his" "pid IN ($RAW_MAINPARTS_PARENT_ID)" 0 #报表-转动设备-主要零部件状态表-明细表(历史)
    export_table "rep_drawing_state_rotating_equipment" "docid IN (${DOC_IDS})" 0     #报表-转动设备-图纸工艺文件状态表
    export_table "rep_drawing_state_rotating_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-转动设备-图纸工艺文件状态表(历史)
    WXWG_EQUIPMENT_PARENT_ID="SELECT id FROM rep_wxwg_equipment where docid IN (${DOC_IDS})"
    export_table "rep_wxwg_equipment" "docid IN (${DOC_IDS})" 0     #报表-炉类-外协件外购件状态表-主表
    export_table "rep_wxwg_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-炉类-外协件外购件状态表-主表(历史)
    export_table "rep_wxwg_equipment_list" "pid IN ($WXWG_EQUIPMENT_PARENT_ID)" 0     #报表-炉类-外协件外购件状态表-明细表
    export_table "rep_wxwg_equipment_list_his" "pid IN ($WXWG_EQUIPMENT_PARENT_ID)" 0 #报表-炉类-外协件外购件状态表-明细表(历史)
    LG_WXWG_EQUIPMENT_PARENT_ID="SELECT id FROM rep_lg_wxwg_equipment where docid IN (${DOC_IDS})"
    export_table "rep_lg_wxwg_equipment" "docid IN (${DOC_IDS})" 0     #报表-炉类-炉管状态表-主表
    export_table "rep_lg_wxwg_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-炉类-炉管状态表-主表(历史)
    export_table "rep_lg_wxwg_equipment_list" "pid IN ($LG_WXWG_EQUIPMENT_PARENT_ID)" 0     #报表-炉类-炉管状态表-明细表
    export_table "rep_lg_wxwg_equipment_list_his" "pid IN ($LG_WXWG_EQUIPMENT_PARENT_ID)" 0 #报表-炉类-炉管状态表-明细表(历史)
    CL_EQUIPMENT_PARENT_ID="SELECT id FROM rep_cl_equipment where docid IN (${DOC_IDS})"
    export_table "rep_cl_equipment" "docid IN (${DOC_IDS})" 0     #报表-炉类-衬里状态表-主表
    export_table "rep_cl_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-炉类-衬里状态表-主表(历史)
    export_table "rep_cl_equipment_list" "pid IN ($CL_EQUIPMENT_PARENT_ID)" 0 #报表-炉类-衬里状态表-明细表
    export_table "rep_cl_equipment_list_his" "pid IN ($CL_EQUIPMENT_PARENT_ID)" 0 #报表-炉类-衬里状态表-明细表(历史)
    GJG_EQUIPMENT_PARENT_ID="SELECT id FROM rep_gjg_equipment where docid IN (${DOC_IDS})"
    export_table "rep_gjg_equipment" "docid IN (${DOC_IDS})" 0     #报表-炉类-钢结构状态表-主表
    export_table "rep_gjg_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-炉类-钢结构状态表-主表(历史)
    export_table "rep_gjg_equipment_list" "pid IN ($GJG_EQUIPMENT_PARENT_ID)" 0     #报表-炉类-钢结构状态表-明细表
    export_table "rep_gjg_equipment_list_his" "pid IN ($GJG_EQUIPMENT_PARENT_ID)" 0 #报表-炉类-钢结构状态表-明细表(历史)
    JHG_EQUIPMENT_PARENT_ID="SELECT id FROM rep_jhg_wxwg_equipment where docid IN (${DOC_IDS})"
    export_table "rep_jhg_wxwg_equipment" "docid IN (${DOC_IDS})" 0     #报表-炉类-集合管状态表-主表
    export_table "rep_jhg_wxwg_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-炉类-集合管状态表-主表(历史)
    export_table "rep_jhg_wxwg_equipment_list" "pid IN ($JHG_EQUIPMENT_PARENT_ID)" 0     #报表-炉类-集合管状态表-明细表
    export_table "rep_jhg_wxwg_equipment_list_his" "pid IN ($JHG_EQUIPMENT_PARENT_ID)" 0 #报表-炉类-集合管状态表-明细表(历史)
    export_table "rep_drawing_ll_equipment" "docid IN (${DOC_IDS})" 0     #报表-炉类-图纸工艺文件状态表
    export_table "rep_drawing_ll_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-炉类-图纸工艺文件状态表(历史)
    DQ_WXWG_EQUIPMENT_PARENT_ID="SELECT id FROM rep_dq_wxwg_equipment where docid IN (${DOC_IDS})"
    export_table "rep_dq_wxwg_equipment" "docid IN (${DOC_IDS})" 0     #报表-电气及其他通用设备-外协件外购件状态表-主表
    export_table "rep_dq_wxwg_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-电气及其他通用设备-外协件外购件状态表-主表(历史)
    export_table "rep_dq_wxwg_equipment_list" "pid IN ($DQ_WXWG_EQUIPMENT_PARENT_ID)" 0     #报表-电气及其他通用设备-外协件外购件状态表-明细表
    export_table "rep_dq_wxwg_equipment_list_his" "pid IN ($DQ_WXWG_EQUIPMENT_PARENT_ID)" 0 #报表-电气及其他通用设备-外协件外购件状态表-明细表(历史)
    DQ_LBJ_WXWG_EQUIPMENT_PARENT_ID="SELECT id FROM rep_dq_lbj_equipment where docid IN (${DOC_IDS})"
    export_table "rep_dq_lbj_equipment" "docid IN (${DOC_IDS})" 0 #报表-电气及其他通用设备-主要零部件状态表-主表
    export_table "rep_dq_lbj_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-电气及其他通用设备-主要零部件状态表-主表(历史)
    export_table "rep_dq_lbj_equipment_list" "pid IN ($DQ_LBJ_WXWG_EQUIPMENT_PARENT_ID)" 0 #报表-电气及其他通用设备-主要零部件状态表-明细表
    export_table "rep_dq_lbj_equipment_list_his" "pid IN ($DQ_LBJ_WXWG_EQUIPMENT_PARENT_ID)" 0 #报表-电气及其他通用设备-主要零部件状态表-明细表(历史)
    export_table "rep_drawing_dqsb_equipment" "docid IN (${DOC_IDS})" 0 #报表-电气及其他通用设备-图纸工艺文件状态表
    export_table "rep_drawing_dqsb_equipment_his" "docid IN (${DOC_IDS})" 0 #报表-电气及其他通用设备-图纸工艺文件状态表(历史)
    #统计进度
    export_table "plan_list" "projectid IN ($DEVICE_ID) AND del_flag=0" 0
    export_table "plan_list_history" "projectid IN ($DEVICE_ID) AND del_flag=0" 0
    export_table "plan_list_submit" "projectid IN ($DEVICE_ID) AND del_flag=0" 0
    #巡检报告
    export_table "project_inspection_file" "dispatchid IN (${DISPATCH_IDS}) AND del_flag=0" 1
    #放行单
    SYS_RELEASE_NOTE_ID="SELECT id FROM sys_release_note WHERE fid IN (${DISPATCH_IDS}) AND del_flag=0"
    export_table "sys_release_note" "id IN ($SYS_RELEASE_NOTE_ID)" 0
    export_table "sys_release_note_list" "fid IN ($SYS_RELEASE_NOTE_ID)" 0
    export_table "sys_release_note_equipment" "fid IN ($SYS_RELEASE_NOTE_ID)" 0

    # 细则相关表
    local tables_direct=(
        "rep_jxyzsyjzb" "rep_myslsyjzjl" "rep_sqcqzzxn"
        "rep_yzsygzj1"
        "rep_zyjlxm" "rep_zzdphjcssyjz" "rep_wfsysj1" "rep_wfsysj2"
        "rep_wfsysjsc1" "rep_wfsysjsc2" "rep_cone_inspection" "rep_dxfdj1"
    )
    for tbl in "${tables_direct[@]}"; do
        export_table "$tbl" "docid IN (${DOC_IDS})" 0
    done
    export_table "rep_syjz_b_tp1" "id1 IN (SELECT id FROM rep_syjz_b WHERE  docid IN (${DOC_IDS}))" 0
    export_table "rep_yxtyzsyjz_tp1" "id1 IN (SELECT id FROM rep_yxtyzsyjz WHERE  docid IN (${DOC_IDS}))" 0
    export_table "rep_yxtyzsyjz_tp2" "id2 IN (SELECT id FROM rep_yxtyzsyjz WHERE  docid IN (${DOC_IDS}))" 0
    # 细则任务组
    declare -a tasks=(
        #两个层级
        "rep_basics_test|rep_basics_test_list|"
        "rep_welding_technology|rep_weld_technology_list|"
        "rep_bzcbcx_dctjbz_data|rep_bzcbcx_dctjbz_data_list|"
        "rep_bzcbcx_dcztbz_data|rep_bzcbcx_dcztbz_data_list|"
        "rep_cdjghqtsyjcjzb|rep_cdjghqtsyjcjzb_list|"
        "rep_cxftjyjzjl|rep_cxftjyjzjl_list|"
        "rep_cxztjyjzjl|rep_cxztjyjzjl_list|"
        "rep_djphsyjz_b|rep_djphsyjz_b_list|"
        "rep_djtjjyjl_ptsb|rep_djtjjyjl_ptsb_list|"
        "rep_djtjjyjl_zysb|rep_djtjjyjl_zysb_list|"
        "rep_dldmkjyjzjl|rep_dldmkjyjzjl_list|"
        "rep_dldyzzjyjzjl|rep_dldyzzjyjzjl_list|"
        "rep_ecnjyzzccjcjl|rep_ecnjyzzccjcjl_list|"
        "rep_fbftjyjzjlb_data|rep_fbftjyjzjlb_data_list|"
        "rep_fdtqztzzjcjlb_data|rep_fdtqztzzjcjlb_data_list|"
        "rep_flange_check|rep_flange_check_list|"
        "rep_fpzthhjyjlb|rep_fpzthhjyjlb_list|"
        "rep_fpztjyjzjlb_data|rep_fpztjyjzjlb_data_list|"
        "rep_fpztzzjyjzjlb|rep_fpztzzjyjzjlb_list|"
        "rep_fsddpjyjzjl|rep_fsddpjyjzjl_list|"
        "rep_fsdyzzjyjzjl|rep_fsdyzzjyjzjl_list|"
        "rep_ftxljyjl|rep_ftxljyjl_list|"
        "rep_gcjyjz|rep_gcjyjz_list|"
        "rep_general_purpose|rep_general_purpose_list|"
        "rep_glbzjnysyjyjl|rep_glbzjnysyjyjl_list|"
        "rep_gqmfszjqmsyjz|rep_gqmfszjqmsyjz_list|"
        "rep_gszzjcxjyjzjl_data|rep_gszzjcxjyjzjl_data_list|"
        "rep_hdchxcf|rep_hdchxcf_list|"
        "rep_head_group|rep_head_group_list|"
        "rep_head_group_after|rep_head_group_after_list|"
        "rep_heat_treatment|rep_heat_treatment_list|"
        "rep_hfbzhhfbht|rep_hfbzhhfbht_list|"
        "rep_hfhxcf|rep_hfhxcf_list|"
        "rep_hjjyjl|rep_hjjyjl_list|"
        "rep_hrgygbzjjyjzjlb_data|rep_hrgygbzjjyjzjlb_data_list|"
        "rep_incoming_profile|rep_incoming_profile_list|"
        "rep_infiltration|rep_infiltration_list|"
        "rep_jgzzjyjzjl|rep_jgzzjyjzjl_list|"
        "rep_jkhxkkjzjk|rep_jkhxkkjzjk_list|"
        "rep_jtzlzjzzzzjy|rep_jtzlzjzzzzjy_list|"
        "rep_jzlclsggcyjzjlb|rep_jzlclsggcyjzjlb_list|"
        "rep_jzlclsghyjzjlb|rep_jzlclsghyjzjlb_list|"
        "rep_jzlclsgqyjzjlb|rep_jzlclsgqyjzjlb_list|"
        "rep_kzxjyjl|rep_kzxjyjl_list|"
        "rep_ltrtzk|rep_ltrtzk_list|"
        "rep_material_quality|rep_material_quality_list|"
        "rep_qgrcl|rep_qgrcl_list|"
        "rep_qkbzzjyjzjl|rep_qkbzzjyjzjl_list|"
        "rep_radial|rep_radial_list|"
        "rep_rcljyjla|rep_rcljyjla_list|"
        "rep_rotor_runout|rep_rotor_runout_list|"
        "rep_rtsyjz|rep_rtsyjz_list|"
        "rep_rwdxsyjzb|rep_rwdxsyjzb_list|"
        "rep_scjdtljcb|rep_scjdtljcb_list|"
        "rep_slsyjyjlb|rep_slsyjyjlb_list|"
        "rep_sxgjgpnyjzjl|rep_sxgjgpnyjzjl_list|"
        "rep_sxgjgptqsyjzjl|rep_sxgjgptqsyjzjl_list|"
        "rep_tcqwlcljcjl|rep_tcqwlcljcjl_list|"
        "rep_tjxljyjl_ptsb|rep_tjxljyjl_ptsb_list|"
        "rep_tjxljyjl_zysb|rep_tjxljyjl_zysb_list|"
        "rep_tnjccjcjl|rep_tnjccjcjl_list|"
        "rep_tssyjz|rep_tssyjz_list|"
        "rep_ttfdjzyhxjyjzjlb_data|rep_ttfdjzyhxjyjzjlb_data_list|"
        "rep_ultrasonic|rep_ultrasonic_list|"
        "rep_wgccwgjyjl|rep_wgccwgjyjl_list|"
        "rep_wgjjcjz|rep_wgjjcjz_list|"
        "rep_wsjcjl|rep_wsjcjl_list|"
        "rep_xssyjz|rep_xssyjz_list|"
        "rep_ydjyjlb_check|rep_ydjyjlb_check_list|"
        "rep_ydycfdjyjzjl|rep_ydycfdjyjzjl_list|"
        "rep_yhjjyjzjl|rep_yhjjyjzjl_list|"
        "rep_ylcssyjzjl|rep_ylcssyjzjl_list|"
        "rep_ylrqjyjlb|rep_ylrqjyjlb_list|"
        "rep_zcljcjl|rep_zcljcjl_list|"
        "rep_zjrcjyjzjl|rep_zjrcjyjzjl_list|"
        "rep_ztxljyjl|rep_ztxljyjl_list|"
        "rep_zzjcjz|rep_zzjcjz_list|"
        "rep_zzjyjzjlb_data|rep_zzjyjzjlb_data_list|"
        "rep_dwxnsyjzbdwfm|rep_dwxnsyjzbdwfm_bh_list|"
        "rep_hcjyjzjlb_data|rep_hcjyjzjlb_list|"
        "rep_qzjyjzjlb_data|rep_qzjyjzjlb_list|"
        "rep_welding_quality|rep_weld_quality_list|"
        # 两个层级，多个二级表
        "rep_jxyzsyjlb|rep_jxyzsyjlb_list rep_jxyzsyjlb_list_list|"
        "rep_jxyzsyjlb_qlj|rep_jxyzsyjlb_qlj_list rep_jxyzsyjlb_qlj_list_list|"
        "rep_lgysj|rep_lgysj_list1 rep_lgysj_list2 rep_lgysj_list3 rep_lgysj_list4|"
        "rep_nyqmsyjz|rep_nyqmsyjz_bh_list rep_nyqmsyjz_jcbw_list|"
        "rep_rtjxyzsyjzb|rep_rtjxyzsyjzb_imglist rep_rtjxyzsyjzb_list|"
        "rep_syjz_b|rep_syjz_b_bxgcs_list rep_syjz_b_xljc_list rep_syjz_b_xnsy_hs_list rep_syjz_b_xnsy_list rep_syjz_b_zcwd_list rep_syjz_b_zdcs_list rep_syjz_b_zycl_list|"
        "rep_syjz_mjb|rep_syjz_mjb_bxgcs_list rep_syjz_mjb_xnsy_list rep_syjz_mjb_zcwd_list rep_syjz_mjb_zdcs_list|"
        "rep_syjzjl|rep_syjzjl_tplist rep_syjzjl_wzlist|"
        "rep_yxtyzsyjz|rep_yxtyzsyjz_cszb_list rep_yxtyzsyjz_cx_list rep_yxtyzsyjz_gncs_list rep_yxtyzsyjz_syjl_list rep_yxtyzsyjz_yxwj_list|"
        "rep_yzsygzj|rep_yzsygzj_list1 rep_yzsygzj_list2 rep_yzsygzj_list3|"
        "rep_zzqjzjl|rep_zzqjzjl_tplist rep_zzqjzjl_wzlist|"
        "rep_dxfdj|rep_dxfdj_list1 rep_dxfdj_list2 rep_dxfdj_list3 rep_dxfdj_list4|"
        # 两个层级，关联字段特殊
        "rep_dhchdjyjl|rep_dhchdjyjl_list||documentid"
        "rep_wfsysj|rep_wfsysj_list1 rep_wfsysj_list2 rep_wfsysj_list3||fid"
        "rep_wfsysjsc|rep_wfsysjsc_list1 rep_wfsysjsc_list2 rep_wfsysjsc_list3||fid"
        "rep_completion_data|rep_completion_data_list||documentid"
        "rep_jxjyjl|rep_jxjyjl_list||documentid"
        "rep_other_check|rep_other_check_list||documentid"
        "rep_packing_record|rep_packing_record_list||documentid"
        "rep_pmijyjl|rep_pmijyjl_list||documentid"
        "rep_sand_blasting_paint|rep_sand_blasting_paint_list||documentid"
        "rep_txthljyjl|rep_txthljyjl_list||documentid"
        "rep_withstand_appearance|rep_withstand_appearance_list||documentid"
        "rep_zyrcljyjzjl|rep_zyrcljyjzjl_list||documentid"
        # 这个主表特殊，主键zid
        "rep_qgnysy|rep_qgnysy_list1 rep_qgnysy_list2 rep_qgnysy_list3||||zid"
        # 三个层级
        "rep_clhljyjlb|rep_clhljyjlb_list|rep_clhljyjlb_list_list"
        "rep_retest_material|rep_retest_material_list|rep_retest_material_list_list"
        "rep_bpjyjzjlb|rep_bpjyjzjlb_list|rep_bpjyjzjlb_list_list"
        "rep_bxpzjcpjyjlb|rep_bxpzjcpjyjlb_list|rep_bxpzjcpjyjlb_list_list"
        "rep_byccpjyjzjlb|rep_byccpjyjzjlb_list|rep_byccpjyjzjlb_list_list"
        "rep_bzhbpbjjyjlba|rep_bzhbpbjjyjlba_list|rep_bzhbpbjjyjlba_list_list"
        "rep_bzjjgjyjzb|rep_bzjjgjyjzb_list|rep_bzjjgjyjzb_list_list"
        "rep_ccjyjz|rep_ccjyjz_list|rep_ccjyjz_list_list"
        "rep_cljzjyjlb|rep_cljzjyjlb_list|rep_cljzjyjlb_list_list"
        "rep_cpgcpjyjzjlb|rep_cpgcpjyjzjlb_list|rep_cpgcpjyjzjlb_list_list"
        "rep_cpwgjcjlb|rep_cpwgjcjlb_list|rep_cpwgjcjlb_list_list"
        "rep_cxgjjyjzjlb|rep_cxgjjyjzjlb_list|rep_cxgjjyjzjlb_list_list"
        "rep_dygjyjzjlb|rep_dygjyjzjlb_list|rep_dygjyjzjlb_list_list"
        "rep_fdsbzzjyjzjl|rep_fdsbzzjyjzjl_list|rep_fdsbzzjyjzjl_list_list"
        "rep_fdtqztzzjcjlb|rep_fdtqztzzjcjlb_list|rep_fdtqztzzjcjlb_list_list"
        "rep_fjjyjzjlb|rep_fjjyjzjlb_list|rep_fjjyjzjlb_list_list"
        "rep_fpcxjyjzjlb|rep_fpcxjyjzjlb_list|rep_fpcxjyjzjlb_list_list"
        "rep_fpzzjyjzjlb|rep_fpzzjyjzjlb_list|rep_fpzzjyjzjlb_list_list"
        "rep_ftyzjyjzjlb|rep_ftyzjyjzjlb_list|rep_ftyzjyjzjlb_list_list"
        "rep_gbcpjyjzjl|rep_gbcpjyjzjl_list|rep_gbcpjyjzjl_list_list"
        "rep_gjgdblccwgjyjlb|rep_gjgdblccwgjyjlb_list|rep_gjgdblccwgjyjlb_list_list"
        "rep_gjglzccwgjyjlb|rep_gjglzccwgjyjlb_list|rep_gjglzccwgjyjlb_list_list"
        "rep_gsbcpjyjzjlb|rep_gsbcpjyjzjlb_list|rep_gsbcpjyjzjlb_list_list"
        "rep_gxjyjzjlb|rep_gxjyjzjlb_list|rep_gxjyjzjlb_list_list"
        "rep_hjgxjcjlb|rep_hjgxjcjlb_list|rep_hjgxjcjlb_list_list"
        "rep_incoming_casting|rep_incoming_casting_list|rep_incoming_casting_list_list"
        "rep_incoming_forging|rep_incoming_forging_list|rep_incoming_forging_list_list"
        "rep_incoming_hc|rep_incoming_hc_list|rep_incoming_hc_list_list"
        "rep_incoming_pipe|rep_incoming_pipe_list|rep_incoming_pipe_list_list"
        "rep_incoming_plate|rep_incoming_plate_list|rep_incoming_plate_list_list"
        "rep_jbzzyzzjkzscjcjz|rep_jbzzyzzjkzscjcjz_list|rep_jbzzyzzjkzscjcjz_list_list"
        "rep_jgcpjyjzjlb|rep_jgcpjyjzjlb_list|rep_jgcpjyjzjlb_list_list"
        "rep_jgjrcjyjzjlb|rep_jgjrcjyjzjlb_list|rep_jgjrcjyjzjlb_list_list"
        "rep_jrgjyjlb|rep_jrgjyjlb_list|rep_jrgjyjlb_list_list"
        "rep_jxlxjyjzjl|rep_jxlxjyjzjl_list|rep_jxlxjyjzjl_list_list"
        "rep_lxjzgjyjzjl|rep_lxjzgjyjzjl_list|rep_lxjzgjyjzjl_list_list"
        "rep_lxsy|rep_lxsy_list|rep_lxsy_list_list"
        "rep_mbjyjzjl|rep_mbjyjzjl_list|rep_mbjyjzjl_list_list"
        "rep_mbjyjzjlb|rep_mbjyjzjlb_list|rep_mbjyjzjlb_list_list"
        "rep_mkkjccwgjyjlb|rep_mkkjccwgjyjlb_list|rep_mkkjccwgjyjlb_list_list"
        "rep_ntyclrtjyjlb|rep_ntyclrtjyjlb_list|rep_ntyclrtjyjlb_list_list"
        "rep_pgjyjzjl|rep_pgjyjzjl_list|rep_pgjyjzjl_list_list"
        "rep_pgjyjzjlb|rep_pgjyjzjlb_list|rep_pgjyjzjlb_list_list"
        "rep_psptjcjzjl|rep_psptjcjzjl_list|rep_psptjcjzjl_list_list"
        "rep_qgzzjyjz|rep_qgzzjyjz_list|rep_qgzzjyjz_list_list"
        "rep_relevant_material|rep_relevant_material_list|rep_relevant_material_list_list"
        "rep_rgtjyjzjl|rep_rgtjyjzjl_list|rep_rgtjyjzjl_list_list"
        "rep_sbjwjyjzjlb|rep_sbjwjyjzjlb_list|rep_sbjwjyjzjlb_list_list"
        "rep_sjjyjl|rep_sjjyjl_list|rep_sjjyjl_list_list"
        "rep_sxgccwgjyjlb|rep_sxgccwgjyjlb_list|rep_sxgccwgjyjlb_list_list"
        "rep_sxgfyjyjlb|rep_sxgfyjyjlb_list|rep_sxgfyjyjlb_list_list"
        "rep_tjjjgjyjzjl|rep_tjjjgjyjzjl_list|rep_tjjjgjyjzjl_list_list"
        "rep_tt_fd_jyjl|rep_tt_fd_jyjl_list|rep_tt_fd_jyjl_list_list"
        "rep_ttjjgjyjzjl|rep_ttjjgjyjzjl_list|rep_ttjjgjyjzjl_list_list"
        "rep_tzgywjscjl|rep_tzgywjscjl_list|rep_tzgywjscjl_list_list"
        "rep_uxhrgcpjyjzjl|rep_uxhrgcpjyjzjl_list|rep_uxhrgcpjyjzjl_list_list"
        "rep_wgjccjcjl|rep_wgjccjcjl_list|rep_wgjccjcjl_list_list"
        "rep_wxwgjrcjyjlb|rep_wxwgjrcjyjlb_list|rep_wxwgjrcjyjlb_list_list"
        "rep_ycllh|rep_ycllh_list|rep_ycllh_list_list"
        "rep_ysdjyjzjl|rep_ysdjyjzjl_list|rep_ysdjyjzjl_list_list"
        "rep_zfzzjyjzjl|rep_zfzzjyjzjl_list|rep_zfzzjyjzjl_list_list"
        "rep_zlbcpjyjzjl|rep_zlbcpjyjzjl_list|rep_zlbcpjyjzjl_list_list"
        "rep_zongzjyjzjl|rep_zongzjyjzjl_list|rep_zongzjyjzjl_list_list"
        "rep_ztyzzjcjzjl|rep_ztyzzjcjzjl_list|rep_ztyzzjcjzjl_list_list"
        "rep_zxjyjzjl|rep_zxjyjzjl_list|rep_zxjyjzjl_list_list"
        "rep_zxtssjjyjzjl|rep_zxtssjjyjzjl_list|rep_zxtssjjyjzjl_list_list"
        "rep_zzjyjzjl|rep_zzjyjzjl_list|rep_zzjyjzjl_list_list"
        "rep_zzypcpjyjzjl|rep_zzypcpjyjzjl_list|rep_zzypcpjyjzjl_list_list"
        "rep_xljyjl|rep_xljyjl_list|rep_xljyjl_list_jyxm"
        "rep_tjjyjzjl|rep_tjjyjzjl_list|rep_tjjyjzjl_list_jyxm"
        "rep_rlqdxnyzsyjz|rep_rlqdxnyzsyjz_edzs rep_rlqdxnyzsyjz_xm|rep_rlqdxnyzsyjz_edzs_list"
        "rep_syjz_zsb|rep_syjz_zsb_xnsy|rep_syjz_zsb_xnsy_list|pid|fid"
    )
    for task in "${tasks[@]}"; do
        IFS='|' read -r primary secondary tertiary param tparam mparam <<< "$task"
        export_group "$primary" "$secondary" "$tertiary" "$param" "$tparam" "$mparam"
    done

    # 日周月报历史表
    local hist_tables=(
        "rep_jxyzsyjzb_his" "rep_myslsyjzjl_his" "rep_sqcqzzxn_his"
        "rep_yzsygzj1_his" "rep_zyjlxm_his" "rep_zzdphjcssyjz_his"
        "rep_wfsysj1_his" "rep_wfsysj2_his" "rep_wfsysjsc1_his" "rep_wfsysjsc2_his"
        "rep_dxfdj1_his"
    )
    for tbl in "${hist_tables[@]}"; do
        export_table "$tbl" "docid IN (${DOC_IDS})" 0
    done
    export_table "rep_syjz_b_tp1_his" "id1 IN (SELECT id FROM rep_syjz_b WHERE  docid IN (${DOC_IDS}))" 0
    export_table "rep_yxtyzsyjz_tp1_his" "id1 IN (SELECT id FROM rep_yxtyzsyjz WHERE  docid IN (${DOC_IDS}))" 0
    export_table "rep_yxtyzsyjz_tp2_his" "id2 IN (SELECT id FROM rep_yxtyzsyjz WHERE  docid IN (${DOC_IDS}))" 0
    # 历史任务组
    declare -a tasks_his=(
        "rep_basics_test_his|rep_basics_test_list_his|"
        "rep_welding_technology_his|rep_weld_technology_list_his|"
        "rep_bzcbcx_dctjbz_data_his|rep_bzcbcx_dctjbz_data_list_his|"
        "rep_bzcbcx_dcztbz_data_his|rep_bzcbcx_dcztbz_data_list_his|"
        "rep_cdjghqtsyjcjzb_his|rep_cdjghqtsyjcjzb_list_his|"
        "rep_cxftjyjzjl_his|rep_cxftjyjzjl_list_his|"
        "rep_cxztjyjzjl_his|rep_cxztjyjzjl_list_his|"
        "rep_djphsyjz_b_his|rep_djphsyjz_b_list_his|"
        "rep_djtjjyjl_ptsb_his|rep_djtjjyjl_ptsb_list_his|"
        "rep_djtjjyjl_zysb_his|rep_djtjjyjl_zysb_list_his|"
        "rep_dldmkjyjzjl_his|rep_dldmkjyjzjl_list_his|"
        "rep_dldyzzjyjzjl_his|rep_dldyzzjyjzjl_list_his|"
        "rep_ecnjyzzccjcjl_his|rep_ecnjyzzccjcjl_list_his|"
        "rep_fbftjyjzjlb_data_his|rep_fbftjyjzjlb_data_list_his|"
        "rep_fdtqztzzjcjlb_data_his|rep_fdtqztzzjcjlb_data_list_his|"
        "rep_flange_check_his|rep_flange_check_list_his|"
        "rep_fpzthhjyjlb_his|rep_fpzthhjyjlb_list_his|"
        "rep_fpztjyjzjlb_data_his|rep_fpztjyjzjlb_data_list_his|"
        "rep_fpztzzjyjzjlb_his|rep_fpztzzjyjzjlb_list_his|"
        "rep_fsddpjyjzjl_his|rep_fsddpjyjzjl_list_his|"
        "rep_fsdyzzjyjzjl_his|rep_fsdyzzjyjzjl_list_his|"
        "rep_gcjyjz_his|rep_gcjyjz_list_his|"
        "rep_general_purpose_his|rep_general_purpose_list_his|"
        "rep_glbzjnysyjyjl_his|rep_glbzjnysyjyjl_list_his|"
        "rep_gqmfszjqmsyjz_his|rep_gqmfszjqmsyjz_list_his|"
        "rep_gszzjcxjyjzjl_data_his|rep_gszzjcxjyjzjl_data_list_his|"
        "rep_hdchxcf_his|rep_hdchxcf_list_his|"
        "rep_head_group_his|rep_head_group_list_his|"
        "rep_head_group_after_his|rep_head_group_after_list_his|"
        "rep_heat_treatment_his|rep_heat_treatment_list_his|"
        "rep_hfbzhhfbht_his|rep_hfbzhhfbht_list_his|"
        "rep_hfhxcf_his|rep_hfhxcf_list_his|"
        "rep_hjjyjl_his|rep_hjjyjl_list_his|"
        "rep_hrgygbzjjyjzjlb_data_his|rep_hrgygbzjjyjzjlb_data_list_his|"
        "rep_incoming_profile_his|rep_incoming_profile_list_his|"
        "rep_infiltration_his|rep_infiltration_list_his|"
        "rep_jgzzjyjzjl_his|rep_jgzzjyjzjl_list_his|"
        "rep_jkhxkkjzjk_his|rep_jkhxkkjzjk_list_his|"
        "rep_jtzlzjzzzzjy_his|rep_jtzlzjzzzzjy_list_his|"
        "rep_jzlclsggcyjzjlb_his|rep_jzlclsggcyjzjlb_list_his|"
        "rep_jzlclsghyjzjlb_his|rep_jzlclsghyjzjlb_list_his|"
        "rep_jzlclsgqyjzjlb_his|rep_jzlclsgqyjzjlb_list_his|"
        "rep_kzxjyjl_his|rep_kzxjyjl_list_his|"
        "rep_ltrtzk_his|rep_ltrtzk_list_his|"
        "rep_material_quality_his|rep_material_quality_list_his|"
        "rep_qgrcl_his|rep_qgrcl_list_his|"
        "rep_qkbzzjyjzjl_his|rep_qkbzzjyjzjl_list_his|"
        "rep_radial_his|rep_radial_list_his|"
        "rep_rcljyjla_his|rep_rcljyjla_list_his|"
        "rep_rotor_runout_his|rep_rotor_runout_list_his|"
        "rep_rtsyjz_his|rep_rtsyjz_list_his|"
        "rep_rwdxsyjzb_his|rep_rwdxsyjzb_list_his|"
        "rep_scjdtljcb_his|rep_scjdtljcb_list_his|"
        "rep_slsyjyjlb_his|rep_slsyjyjlb_list_his|"
        "rep_sxgjgpnyjzjl_his|rep_sxgjgpnyjzjl_list_his|"
        "rep_sxgjgptqsyjzjl_his|rep_sxgjgptqsyjzjl_list_his|"
        "rep_tcqwlcljcjl_his|rep_tcqwlcljcjl_list_his|"
        "rep_tjxljyjl_ptsb_his|rep_tjxljyjl_ptsb_list_his|"
        "rep_tjxljyjl_zysb_his|rep_tjxljyjl_zysb_list_his|"
        "rep_tnjccjcjl_his|rep_tnjccjcjl_list_his|"
        "rep_tssyjz_his|rep_tssyjz_list_his|"
        "rep_ttfdjzyhxjyjzjlb_data_his|rep_ttfdjzyhxjyjzjlb_data_list_his|"
        "rep_ultrasonic_his|rep_ultrasonic_list_his|"
        "rep_wgccwgjyjl_his|rep_wgccwgjyjl_list_his|"
        "rep_wgjjcjz_his|rep_wgjjcjz_list_his|"
        "rep_wsjcjl_his|rep_wsjcjl_list_his|"
        "rep_xssyjz_his|rep_xssyjz_list_his|"
        "rep_ydjyjlb_check_his|rep_ydjyjlb_check_list_his|"
        "rep_ydycfdjyjzjl_his|rep_ydycfdjyjzjl_list_his|"
        "rep_yhjjyjzjl_his|rep_yhjjyjzjl_list_his|"
        "rep_ylcssyjzjl_his|rep_ylcssyjzjl_list_his|"
        "rep_ylrqjyjlb_his|rep_ylrqjyjlb_list_his|"
        "rep_zcljcjl_his|rep_zcljcjl_list_his|"
        "rep_zjrcjyjzjl_his|rep_zjrcjyjzjl_list_his|"
        "rep_ztxljyjl_his|rep_ztxljyjl_list_his|"
        "rep_zzjcjz_his|rep_zzjcjz_list_his|"
        "rep_zzjyjzjlb_data_his|rep_zzjyjzjlb_data_list_his|"
        "rep_dwxnsyjzbdwfm_his|rep_dwxnsyjzbdwfm_bh_list_his|"
        "rep_hcjyjzjlb_data_his|rep_hcjyjzjlb_list_his|"
        "rep_qzjyjzjlb_data_his|rep_qzjyjzjlb_list_his|"
        "rep_welding_quality_his|rep_weld_quality_list_his|"
        "rep_jxyzsyjlb_his|rep_jxyzsyjlb_list_his rep_jxyzsyjlb_list_list_his|"
        "rep_jxyzsyjlb_qlj_his|rep_jxyzsyjlb_qlj_list_his rep_jxyzsyjlb_qlj_list_list_his|"
        "rep_lgysj_his|rep_lgysj_list1_his rep_lgysj_list2_his rep_lgysj_list3_his rep_lgysj_list4_his|"
        "rep_nyqmsyjz_his|rep_nyqmsyjz_bh_list_his rep_nyqmsyjz_jcbw_list_his|"
        "rep_rtjxyzsyjzb_his|rep_rtjxyzsyjzb_imglist_his rep_rtjxyzsyjzb_list_his|"
        "rep_syjz_b_his|rep_syjz_b_bxgcs_list_his rep_syjz_b_xljc_list_his rep_syjz_b_xnsy_hs_list_his rep_syjz_b_xnsy_list_his rep_syjz_b_zcwd_list_his rep_syjz_b_zdcs_list_his rep_syjz_b_zycl_list_his|"
        "rep_syjz_mjb_his|rep_syjz_mjb_bxgcs_list_his rep_syjz_mjb_xnsy_list_his rep_syjz_mjb_zcwd_list_his rep_syjz_mjb_zdcs_list_his|"
        "rep_syjzjl_his|rep_syjzjl_tplist_his rep_syjzjl_wzlist_his|"
        "rep_yxtyzsyjz_his|rep_yxtyzsyjz_cszb_list_his rep_yxtyzsyjz_cx_list_his rep_yxtyzsyjz_gncs_list_his rep_yxtyzsyjz_syjl_list_his rep_yxtyzsyjz_yxwj_list_his|"
        "rep_yzsygzj_his|rep_yzsygzj_list1_his rep_yzsygzj_list2_his rep_yzsygzj_list3_his|"
        "rep_zzqjzjl_his|rep_zzqjzjl_tplist_his rep_zzqjzjl_wzlist_his|"
        "rep_dxfdj_his|rep_dxfdj_list1_his rep_dxfdj_list2_his rep_dxfdj_list3_his rep_dxfdj_list4_his|"
        "rep_dhchdjyjl_his|rep_dhchdjyjl_list_his||documentid"
        "rep_wfsysj_his|rep_wfsysj_list1_his rep_wfsysj_list2_his rep_wfsysj_list3_his||fid"
        "rep_wfsysjsc_his|rep_wfsysjsc_list1_his rep_wfsysjsc_list2_his rep_wfsysjsc_list3_his||fid"
        "rep_completion_data_his|rep_completion_data_list_his||documentid"
        "rep_jxjyjl_his|rep_jxjyjl_list_his||documentid"
        "rep_other_check_his|rep_other_check_list_his||documentid"
        "rep_packing_record_his|rep_packing_record_list_his||documentid"
        "rep_pmijyjl_his|rep_pmijyjl_list_his||documentid"
        "rep_sand_blasting_paint_his|rep_sand_blasting_paint_list_his||documentid"
        "rep_txthljyjl_his|rep_txthljyjl_list_his||documentid"
        "rep_withstand_appearance_his|rep_withstand_appearance_list_his||documentid"
        "rep_qgnysy_his|rep_qgnysy_list1_his rep_qgnysy_list2_his rep_qgnysy_list3_his||||zid"
        "rep_clhljyjlb_his|rep_clhljyjlb_list_his|rep_clhljyjlb_list_list_his"
        "rep_retest_material_his|rep_retest_material_list_his|rep_retest_material_list_list_his"
        "rep_bpjyjzjlb_his|rep_bpjyjzjlb_list_his|rep_bpjyjzjlb_list_list_his"
        "rep_bxpzjcpjyjlb_his|rep_bxpzjcpjyjlb_list_his|rep_bxpzjcpjyjlb_list_list_his"
        "rep_byccpjyjzjlb_his|rep_byccpjyjzjlb_list_his|rep_byccpjyjzjlb_list_list_his"
        "rep_bzhbpbjjyjlba_his|rep_bzhbpbjjyjlba_list_his|rep_bzhbpbjjyjlba_list_list_his"
        "rep_bzjjgjyjzb_his|rep_bzjjgjyjzb_list_his|rep_bzjjgjyjzb_list_list_his"
        "rep_ccjyjz_his|rep_ccjyjz_list_his|rep_ccjyjz_list_list_his"
        "rep_cljzjyjlb_his|rep_cljzjyjlb_list_his|rep_cljzjyjlb_list_list_his"
        "rep_cpgcpjyjzjlb_his|rep_cpgcpjyjzjlb_list_his|rep_cpgcpjyjzjlb_list_list_his"
        "rep_cpwgjcjlb_his|rep_cpwgjcjlb_list_his|rep_cpwgjcjlb_list_list_his"
        "rep_cxgjjyjzjlb_his|rep_cxgjjyjzjlb_list_his|rep_cxgjjyjzjlb_list_list_his"
        "rep_dygjyjzjlb_his|rep_dygjyjzjlb_list_his|rep_dygjyjzjlb_list_list_his"
        "rep_fdsbzzjyjzjl_his|rep_fdsbzzjyjzjl_list_his|rep_fdsbzzjyjzjl_list_list_his"
        "rep_fdtqztzzjcjlb_his|rep_fdtqztzzjcjlb_list_his|rep_fdtqztzzjcjlb_list_list_his"
        "rep_fjjyjzjlb_his|rep_fjjyjzjlb_list_his|rep_fjjyjzjlb_list_list_his"
        "rep_fpcxjyjzjlb_his|rep_fpcxjyjzjlb_list_his|rep_fpcxjyjzjlb_list_list_his"
        "rep_fpzzjyjzjlb_his|rep_fpzzjyjzjlb_list_his|rep_fpzzjyjzjlb_list_list_his"
        "rep_ftyzjyjzjlb_his|rep_ftyzjyjzjlb_list_his|rep_ftyzjyjzjlb_list_list_his"
        "rep_gbcpjyjzjl_his|rep_gbcpjyjzjl_list_his|rep_gbcpjyjzjl_list_list_his"
        "rep_gjgdblccwgjyjlb_his|rep_gjgdblccwgjyjlb_list_his|rep_gjgdblccwgjyjlb_list_list_his"
        "rep_gjglzccwgjyjlb_his|rep_gjglzccwgjyjlb_list_his|rep_gjglzccwgjyjlb_list_list_his"
        "rep_gsbcpjyjzjlb_his|rep_gsbcpjyjzjlb_list_his|rep_gsbcpjyjzjlb_list_list_his"
        "rep_gxjyjzjlb_his|rep_gxjyjzjlb_list_his|rep_gxjyjzjlb_list_list_his"
        "rep_hjgxjcjlb_his|rep_hjgxjcjlb_list_his|rep_hjgxjcjlb_list_list_his"
        "rep_incoming_casting_his|rep_incoming_casting_list_his|rep_incoming_casting_list_list_his"
        "rep_incoming_forging_his|rep_incoming_forging_list_his|rep_incoming_forging_list_list_his"
        "rep_incoming_hc_his|rep_incoming_hc_list_his|rep_incoming_hc_list_list_his"
        "rep_incoming_pipe_his|rep_incoming_pipe_list_his|rep_incoming_pipe_list_list_his"
        "rep_incoming_plate_his|rep_incoming_plate_list_his|rep_incoming_plate_list_list_his"
        "rep_jbzzyzzjkzscjcjz_his|rep_jbzzyzzjkzscjcjz_list_his|rep_jbzzyzzjkzscjcjz_list_list_his"
        "rep_jgcpjyjzjlb_his|rep_jgcpjyjzjlb_list_his|rep_jgcpjyjzjlb_list_list_his"
        "rep_jgjrcjyjzjlb_his|rep_jgjrcjyjzjlb_list_his|rep_jgjrcjyjzjlb_list_list_his"
        "rep_jrgjyjlb_his|rep_jrgjyjlb_list_his|rep_jrgjyjlb_list_list_his"
        "rep_jxlxjyjzjl_his|rep_jxlxjyjzjl_list_his|rep_jxlxjyjzjl_list_list_his"
        "rep_lxjzgjyjzjl_his|rep_lxjzgjyjzjl_list_his|rep_lxjzgjyjzjl_list_list_his"
        "rep_lxsy_his|rep_lxsy_list_his|rep_lxsy_list_list_his"
        "rep_mbjyjzjl_his|rep_mbjyjzjl_list_his|rep_mbjyjzjl_list_list_his"
        "rep_mbjyjzjlb_his|rep_mbjyjzjlb_list_his|rep_mbjyjzjlb_list_list_his"
        "rep_mkkjccwgjyjlb_his|rep_mkkjccwgjyjlb_list_his|rep_mkkjccwgjyjlb_list_list_his"
        "rep_ntyclrtjyjlb_his|rep_ntyclrtjyjlb_list_his|rep_ntyclrtjyjlb_list_list_his"
        "rep_pgjyjzjl_his|rep_pgjyjzjl_list_his|rep_pgjyjzjl_list_list_his"
        "rep_pgjyjzjlb_his|rep_pgjyjzjlb_list_his|rep_pgjyjzjlb_list_list_his"
        "rep_psptjcjzjl_his|rep_psptjcjzjl_list_his|rep_psptjcjzjl_list_list_his"
        "rep_qgzzjyjz_his|rep_qgzzjyjz_list_his|rep_qgzzjyjz_list_list_his"
        "rep_relevant_material_his|rep_relevant_material_list_his|rep_relevant_material_list_list_his"
        "rep_rgtjyjzjl_his|rep_rgtjyjzjl_list_his|rep_rgtjyjzjl_list_list_his"
        "rep_sbjwjyjzjlb_his|rep_sbjwjyjzjlb_list_his|rep_sbjwjyjzjlb_list_list_his"
        "rep_sjjyjl_his|rep_sjjyjl_list_his|rep_sjjyjl_list_list_his"
        "rep_sxgccwgjyjlb_his|rep_sxgccwgjyjlb_list_his|rep_sxgccwgjyjlb_list_list_his"
        "rep_sxgfyjyjlb_his|rep_sxgfyjyjlb_list_his|rep_sxgfyjyjlb_list_list_his"
        "rep_tjjjgjyjzjl_his|rep_tjjjgjyjzjl_list_his|rep_tjjjgjyjzjl_list_list_his"
        "rep_tt_fd_jyjl_his|rep_tt_fd_jyjl_list_his|rep_tt_fd_jyjl_list_list_his"
        "rep_ttjjgjyjzjl_his|rep_ttjjgjyjzjl_list_his|rep_ttjjgjyjzjl_list_list_his"
        "rep_tzgywjscjl_his|rep_tzgywjscjl_list_his|rep_tzgywjscjl_list_list_his"
        "rep_uxhrgcpjyjzjl_his|rep_uxhrgcpjyjzjl_list_his|rep_uxhrgcpjyjzjl_list_list_his"
        "rep_wgjccjcjl_his|rep_wgjccjcjl_list_his|rep_wgjccjcjl_list_list_his"
        "rep_wxwgjrcjyjlb_his|rep_wxwgjrcjyjlb_list_his|rep_wxwgjrcjyjlb_list_list_his"
        "rep_ycllh_his|rep_ycllh_list_his|rep_ycllh_list_list_his"
        "rep_ysdjyjzjl_his|rep_ysdjyjzjl_list_his|rep_ysdjyjzjl_list_list_his"
        "rep_zfzzjyjzjl_his|rep_zfzzjyjzjl_list_his|rep_zfzzjyjzjl_list_list_his"
        "rep_zlbcpjyjzjl_his|rep_zlbcpjyjzjl_list_his|rep_zlbcpjyjzjl_list_list_his"
        "rep_zongzjyjzjl_his|rep_zongzjyjzjl_list_his|rep_zongzjyjzjl_list_list_his"
        "rep_ztyzzjcjzjl_his|rep_ztyzzjcjzjl_list_his|rep_ztyzzjcjzjl_list_list_his"
        "rep_zxjyjzjl_his|rep_zxjyjzjl_list_his|rep_zxjyjzjl_list_list_his"
        "rep_zxtssjjyjzjl_his|rep_zxtssjjyjzjl_list_his|rep_zxtssjjyjzjl_list_list_his"
        "rep_zzjyjzjl_his|rep_zzjyjzjl_list_his|rep_zzjyjzjl_list_list_his"
        "rep_zzypcpjyjzjl_his|rep_zzypcpjyjzjl_list_his|rep_zzypcpjyjzjl_list_list_his"
        "rep_xljyjl_his|rep_xljyjl_list_his|rep_xljyjl_list_jyxm_his"
        "rep_tjjyjzjl_his|rep_tjjyjzjl_list_his|rep_tjjyjzjl_list_jyxm_his"
        "rep_rlqdxnyzsyjz_his|rep_rlqdxnyzsyjz_edzs_his rep_rlqdxnyzsyjz_xm_his|rep_rlqdxnyzsyjz_edzs_list_his"
        "rep_syjz_zsb_his|rep_syjz_zsb_xnsy_his|rep_syjz_zsb_xnsy_list_his|pid|fid"
    )
    for task in "${tasks_his[@]}"; do
        IFS='|' read -r primary secondary tertiary param tparam mparam <<< "$task"
        export_group "$primary" "$secondary" "$tertiary" "$param" "$tparam" "$mparam"
    done

    # 导出附件
    export_by_ids

    echo -e "\n==> 数据导出完成！"
    ls -lh "$EXPORT_DIR"

    # 压缩加密
    echo -e "\n==> 正在使用加密压缩: ${EXPORT_DIR}"
    (cd "$(dirname "$EXPORT_DIR")" && tar czf - "$(basename "$EXPORT_DIR")") | \
    openssl enc -aes-256-cbc -salt -pass pass:"$ENCRYPT_PASSWORD" -out "${EXPORT_DIR}.tar.gz.enc"

    if [ $? -eq 0 ]; then
        echo "==> 加密压缩完成: ${EXPORT_DIR}.tar.gz.enc"
        rm -rf "$EXPORT_DIR"
        echo "==> 原始目录已删除: ${EXPORT_DIR}"
        ls -lh "${EXPORT_DIR}.tar.gz.enc"
    else
        echo "==> 加密压缩失败，请检查错误信息"
        exit 1
    fi

    echo -e "\n==> 全部操作成功！"
}


# ===================== 解密函数 =====================
do_decrypt() {
    local ENCRYPTED_FILE=$1
    if [ -z "$ENCRYPTED_FILE" ]; then
        echo "用法: $0 decrypt <加密文件.tar.gz.enc>"
        exit 1
    fi
    if [ ! -f "$ENCRYPTED_FILE" ]; then
        echo "错误：文件 '$ENCRYPTED_FILE' 不存在"
        exit 1
    fi
    if ! command -v tar >/dev/null 2>&1 || ! command -v openssl >/dev/null 2>&1; then
        echo "错误：未找到 tar 或 openssl 命令"
        exit 1
    fi

    BASENAME=$(basename "$ENCRYPTED_FILE")
    if [[ "$BASENAME" == *.tar.gz.enc ]]; then
        DIR_NAME="${BASENAME%.tar.gz.enc}"
        OUTPUT_DIR="$PWD/$DIR_NAME"
    else
        echo "错误：文件扩展名必须是 .tar.gz.enc"
        exit 1
    fi

    if [ -d "$OUTPUT_DIR" ]; then
        echo "警告：目录 '$OUTPUT_DIR' 已存在"
        read -p "是否覆盖？(y/N): " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            echo "取消解密"
            exit 0
        fi
        rm -rf "$OUTPUT_DIR"
    fi

    echo "==> 开始解密: $ENCRYPTED_FILE"
    echo "==> 目标目录: $OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR"
    if openssl enc -d -aes-256-cbc -salt -pass pass:"$ENCRYPT_PASSWORD" -in "$ENCRYPTED_FILE" | tar xz --strip-components=1 -C "$OUTPUT_DIR"; then
        echo "==> 解密成功！文件已还原到: $OUTPUT_DIR"
        ls -lh "$OUTPUT_DIR"
    else
        echo "==> 解密失败，请检查密码或文件完整性"
        exit 1
    fi
}

# ===================== 主入口 =====================
case "$1" in
    export)
        if [ -z "$2" ]; then
            echo "用法: $0 export <PROJECT_ID>"
            exit 1
        fi
        do_export "$2"
        ;;
    decrypt)
        if [ -z "$2" ]; then
            echo "用法: $0 decrypt <加密文件.tar.gz.enc>"
            exit 1
        fi
        do_decrypt "$2"
        ;;
    *)
        echo "用法:"
        echo "  导出并加密: $0 export <PROJECT_ID>"
        echo "  解密解压:   $0 decrypt <加密文件.tar.gz.enc>"
        exit 1
        ;;
esac
