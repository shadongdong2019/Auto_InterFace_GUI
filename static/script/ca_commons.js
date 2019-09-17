$(document).ready(function(){

    $('div.head:first').html('');
    $('div.head:first').css('display', 'none');

    $('table tr td .check').each(function(){
        $(this).click(function(){
            if($(this).find('img').css('display') == 'inline' || $(this).find('img').css('display') == 'block'){
                $(this).find('img').css('display', 'none');
                $(this).removeClass('checked');
            } else {
                $(this).find('img').css('display', 'inline');
                $(this).addClass('checked');
            }
        })
    });

    $('.input_submit').hover(function(){
        $(this).css('background-color', '#3394c9');
    }, function(){
        $(this).css('background-color', '#096191');
    });

    //鼠标扫过导航栏上的操作项的效果
//    $(document).on('mouseover mouseout', '.main_list_nav', function(e){
//        if(e.type == 'mouseover'){
//            $(this).css('background-color', '#3394c9');
//            $(this).css('border-right', '1px solid #5ca9d4');
//            $(this).prev().css('border-right', '1px solid #5ca9d4');
//            $(this).next().css('border-left', '0px');
//        } else {
//            $(this).css('background-color', '#096191');
//            $(this).css('border-right', '1px solid #3a80a7');
//            if($(this).prev().attr('class')!='main_list_nav_selected'){
//                $(this).prev().css('border-right', '1px solid #3a80a7');
//            }
//            if($(this).next().attr('class')=='main_list_nav_selected'){
//                $(this).next().css('border-left', '1px solid #5ca9d4');
//                $(this).css('border-right', '0px');
//            }
//        }
//    });
    select_hover('edit_list_select');   // 添加修改页中的select
    select_hover('date1');                // 列表页中的select

});


(function ($) {
    /* 公共插件定义 */
    $.cloud_checkbox = {
        /* checkbox全选、取消全选、反选 */
        checked_all: function(table_id, name_all, name) {
            /*
             *  table_id: checkbox所在表的id
             *  name_all: 负责全选的checkbox的name（仅一个）
             *  name: 表内需要进行全选操作的checkbox的name（一组）
             */
            $("#"+table_id+" .regular-checkbox[name="+name_all+"]").click(function() {
                var v = $(this).prop('checked');
                $("#"+table_id+" .regular-checkbox[name="+name+"]").prop('checked',v);
                $("table .regular-checkbox[name='table_list_check']").change();
            });
        },
        /* 获取所有选中checkbox的值 */
        get_checked_val: function(name) {
            /*
             *  name: 需要获取选中值的checkbox的name（一组）
             */
            var val_list = []
            $(".regular-checkbox[name="+name+"]").each(function() {
                if($(this).prop('checked')) {
                    val_list.push($(this).val());
                }
            });
            return val_list;
        },
        single_checked:function(table_id, name_all, name, id){
            if( !$("#"+id).attr("checked")){
                $("#"+table_id+" .regular-checkbox[name="+name_all+"]").attr("checked", false);
            }else{
                var flag = true;
                $(".regular-checkbox[name="+name+"]").each(function() {
                    if(!$(this).attr('checked')) {
                        flag = false;
                        $("#"+table_id+" .regular-checkbox[name="+name_all+"]").attr("checked", false);
                        return false;
                    }
                });
                if(flag == true){
                    $("#"+table_id+" .regular-checkbox[name="+name_all+"]").attr("checked", "checked");
                }
            }
        }
    };
})(jQuery);

function selectaim(id){
    //控制下拉列表宽度
    if(id != undefined){
        $('#' + id).each(function(){
            $(this).css('width', $(this).parent().find('select').width() + 34);
        });
    } else {
        $('.select2-container').each(function(){
            $(this).css('width', $(this).parent().find('select').width() + 34);
        });
    }
    $('.main_list_pagenum .select2-container').css('width', 26);
}

$.fn.extend({
    showUserInfo:function(){
        var timer;
        $(this).hover(function(){
            var user = $(this);
            timer = setTimeout(function() {
                timer = 0;
                var id = user.attr("id");
                var type = user.attr("class");
                $.post("/tools/get_user_info/", {"id":id, "type":type}, function(html){
                    user.append(html);
                })
            }, 2000);
        }, function(){
            if (timer) {
                clearTimeout(timer);
                timer = 0;
                return;
            }
            $('.card1').hide();
        });
    }
});


var current_path = $(location).attr('pathname');

/**
 * 导航栏 操作项
 * @param element
 */
var nav = function(element){
    $(element).each(function() {
        var v = $(this).attr('rel');
        if(v != current_path){
            $(this).removeClass("main_list_nav").addClass("main_list_nav_unable");
            $(this).attr("href", "javascript:void(0)");
        }
        else{
            $(this).removeClass("main_list_nav").addClass("main_list_nav_selected");
            $(this).prev().css('border-right', '0px');
            $(this).attr("href", "javascript:void(0)");
        }

    });
}


/**
 * 鼠标扫过select标签的效果
 * @param select_class  select标签上div的class
 */
var select_hover = function(select_class){
    $('.'+ select_class).hover(function(){
        $(this).removeClass('undate');
        $(this).find('b').css('background', 'url("/images/downarrow.png") no-repeat center');
        $(this).find('b').parent().css('background-color', '#515151');
        $(this).find('span').css('color', '#544e51');

    }, function(){
        $(this).addClass('undate');
        $(this).find('b').css('background', 'url("/images/greyarrow.png") no-repeat center');
        $(this).find('b').parent().css('background-color', '#dcdadb');
        $(this).find('span').css('color', '#ababab');
    });
}


/**
 * 列表中checkbox的点击事件
 * @param table_id   列表的id
 * @param name_all   列表表头的checkbox
 * @param name_checked   列表中的checkbox
 */
var table_checkbox_click = function(table_id,name_all,name_checked){
    $(".regular-checkbox[name="+name_checked+"]").bind('click',function(){
        var id = $(this).attr("id")
        $.cloud_checkbox.single_checked(table_id,name_all,name_checked,id); //('table_list', 'table_list_checkall', "table_list_check", id);
    });
}

/**
 * 列表中checkbox的change事件
 * @param name_checked   列表中checkbox的name
 */
var table_checkbox_change = function(name_checked){
    $("table .regular-checkbox[name="+name_checked+"]").bind('change',function() {
        var val_list = [];
        var href = null;
        var len = 0
        val_list = $.cloud_checkbox.get_checked_val(name_checked);
        len = val_list.length;
        if(len == 0) {
            $(".navclass a").each(function() {
                if($(this).attr('id') == '11') {
                    $(this).removeClass("main_list_nav").addClass("main_list_nav_unable");
//                    $(this).css('background-color', '#515151');
                    $(this).attr("href", "javascript:void(0)");
                } else if($(this).attr('id') == '13') {
                    $(this).removeClass("main_list_nav").addClass("main_list_nav_unable");
//                    $(this).css('background-color', '#515151');
                    $(this).attr("href", "javascript:void(0)");
                }
            });
        } else if(len == 1) {
            $(".navclass a").each(function() {
                href  = $(this).attr('rel') + '?id=' + val_list;
                if($(this).attr('id') == '11') {
                    $(this).removeClass("main_list_nav_unable").addClass("main_list_nav");
//                    $(this).css('background-color', '#096191');
                    $(this).attr('href', href);
                } else if($(this).attr('id') == '13') {
                    $(this).removeClass("main_list_nav_unable").addClass("main_list_nav");
//                    $(this).css('background-color', '#096191');
                    $(this).attr('href', href);
                }
            });
        } else {
            $(".navclass a").each(function() {
                href  = $(this).attr('rel') + '?id=' + val_list;
                if($(this).attr('id') == '11') {
                    $(this).removeClass("main_list_nav").addClass("main_list_nav_unable");
                    $(this).css('background-color', '#515151');
                    $(this).attr("href", "javascript:void(0)");
                } else if($(this).attr('id') == '13') {
                    $(this).removeClass("main_list_nav_unable").addClass("main_list_nav");
                    $(this).css('background-color', '#096191');
                    $(this).attr('href', href);
                }
            });
        }
    });
}


/**
 * 所有的级联操作
 * @type {{unitToDepart: Function, departToPost: Function, departToUser: Function, unitTodeptype: Function}}
 */
var common = {
    /**
     * 根据机构查询部门列表
     * editor：wujb
     * prarm:unitName：机构下拉框id
     *       departName：部门下拉框id
     *       hidDepart：部门hidden标签id，可以为null或者""
     *       type:判断最后的if判断是否增加,如果等于1就不判断
     */
    'unitToDepart': function(id_unit,id_depart,hidDepart){
         //机构绑定change事件
         $(document).on('change', '#' + id_unit, function(){
         //$().bind('change',function(){
             //获取机构编号
             var unitId = $('#' + id_unit).find('option:selected').val();
             $.post("/tools/get_depart_by_unit/", { "unit_id": unitId},function(data){
                 var deid = $('#' + id_depart);//部门id ：deid
                 deid.empty();
                 deid.append('<option value="0" selected>请选择部门</option>');
                 $.each(data,function(id,option){
                     html  = '<option value="'+option.id+'"';
                     var hidDepObj = $("#" + hidDepart);
                     if(!(hidDepart == null || hidDepart == '')){
                         if (hidDepObj.val() == option.id){
                             html += ' selected';
                         }
                     }
                     html += '>'+ option.dep_list_name +'</option>';
                     deid.append(html);
                     });
                 deid.change();
                }, "json");
         });
        //如果机构已经选择，则查询部门
        if($('#'+id_unit).find('option:selected').val() != 0){
            $('#'+id_unit).change();
        }
    },

    /**
     * 根据部门查询岗位列表
     * editor：wujb
     * prarm:id_depart：部门下拉框id
     *       id_post：岗位下拉框id
     *       hidPost：岗位hidden标签id，可以为null或者""
     */
    'departToPost': function(id_depart,id_post,hidPost,type){
        $(document).on('change', '#' + id_depart, function(){
        //$('#'+id_depart).bind('change',function(){
            var deptId = $('#'+id_depart).find('option:selected').val();
            $.post('/tools/get_post_by_depart/',{ "dep_id": deptId }, function(data){
                var pos = $('#'+id_post);//岗位id ：deid
                pos.empty();
                pos.append('<option value="0">请选择岗位</option>');
                $.each(data,function(id,option){
                    html = '<option value="'+ option.id +'"';
                    var hidPostObj = $("#" + hidPost);
                    if(!(hidPost == null || hidPost == '')){
                        if (hidPostObj.val() == option.id){
                            html += ' selected';
                        }
                    }
                    html += '>' + option.name + '</option>';
                    pos.append(html);
                });
                pos.change();
            }, "json");
        });
        //如果部门已经选择，则查询岗位
        if($('#'+id_depart).find('option:selected').val() != 0){
            $('#'+id_depart).change();
        }
    },

    /**
     * 根据部门查询账户列表
     * editor：ys 2014-8-8
     * prarm:depid：部门下拉框id
     *       uid：账户下拉框id
     *       hidUser：账户hidden标签，可以为null或者""
            ismain:是否查询主岗，1 查主岗，0 查兼职， 2查所有
            mes: 文字描述
     */
    'departToUser': function(depid,uid,ismain,mes,hidUser){
        $(document).on('change', '#' + depid, function(){
        //$('#'+ depid).bind('change',function(){
            var deptId = $('#'+ depid).find('option:selected').val();
            $.post('/tools/get_user_by_depart/',{ "dep_id": deptId, 'ismain':ismain }, function(data){
                var user_id = $('#'+ uid);//账户id ：user_id
                user_id.empty();
                user_id.append('<option value="0">'+ mes +'</option>');
                $.each(data,function(id,option){
                    html = '<option value="'+ option.id +'"';

                    var hidPostObj = $("#" + hidUser);
                    if(!(hidUser == null || hidUser == '')){
                        if (hidPostObj.val() == option.id){
                            html += ' selected';
                        }
                    }
                    html += '>' + option.name + '</option>';
                    user_id.append(html);
                });
                user_id.change();
                selectaim();
            }, "json");
        });
//            //如果部门已经选择，则查询账户
//        if($('#'+ depid).find('option:selected').val() != 0){
            $('#'+ depid).change();
//        }
    },

    /**
     * 根据机构查询部门类型
     * editor：sucy 2014-8-18
     * prarm:id_unit：机构下拉框id
     *       id_dep_type：部门类型下拉框id
     *       hid_dep_type：部门类型hidden标签，可以为null或者""
     */
    'unitTodeptype':function(id_unit,id_dep_type,hid_dep_type){
        $(document).on('change','#' + id_unit,function(){
            var unit_id = $('#'+ id_unit).find('option:selected').val();
            $.post("/ca/organize/depart/alldeptypelist/", { "unid": unit_id },function(data){
                var deid = $('#' + id_dep_type);//部门id ：deid
                deid.empty();
                deid.append('<option value="0">请选择部门类型</option>');
                $.each(data,function(id,option){
                    html  = '<option value="'+option.id+'"';
                    if ($('#' + hid_dep_type).val() == option.id){
                        html += ' selected';
                    }
                    html += '>'+ option.depart_type_name +'</option>'
                    deid.append(html);
                });
                $('#' + id_dep_type).select2();
                selectaim();
            }, "json");
        });
        //如果机构已经选择，则查询部门
        if($('#'+id_unit).find('option:selected').val() != 0){
            $('#'+id_unit).change();
        }
    },

    /**
     * 根据机构查询会议列表
     * editor：wujb
     * describe：
     * prarm:unitName：机构下拉框id
     *       departName：部门下拉框id
     *       hidDepart：部门hidden标签id，可以为null或者""
     */
    'unitToMeeting': function(id_unit,id_meeting,hidMeeting){
         //机构绑定change事件
         $("#" + id_unit).bind('change',function(){
             //获取机构编号
             var unitId = $("#" + id_unit).find('option:selected').val();
             $.post("/tools/get_meeting_by_unit/", { "unit_id": unitId},function(data){
                 var deid = $('#' + id_meeting);//部门id ：deid
                 deid.empty();
                 deid.append('<option value="0" selected>请选择会议</option>');
                 $.each(data,function(id,option){
                     var html  = '<option value="'+option.id+'"';
                     var hidDepObj = $("#" + hidMeeting);
                     if(!(hidMeeting == null || hidMeeting == '')){
                         if (hidDepObj.val() == option.id){
                             html += ' selected';
                         }
                     }
                     html += '>'+ option.name +'</option>';
                     deid.append(html);
                     });
                 deid.change();
                }, "json");
         });
        //如果机构已经选择，则查询部门
        if($("#"+id_unit).find('option:selected').val() != 0){
            $('#'+id_unit).change();
        }
    },
 /**
     * 根据机构查询部门类型
     * editor：sucy 2014-8-18
     * prarm:id_unit：机构下拉框id
     *       id_dep_type：部门类型下拉框id
     *       hid_dep_type：部门类型hidden标签，可以为null或者""
     */
    'prostaTograde':function(id_pro,id_sta,id_gra,hid_gra){
        $('#'+id_sta+','+'#'+id_pro).bind('change',function(){
            var pro_id = $('#'+ id_pro).find('option:selected').val();
            var sta = $('#'+ id_sta).find('option:selected').val();
            $.post("/pm/task/get_grade_list/", { "project": pro_id,"project_status":sta},function(data){
                 var graid = $('#' + id_gra);//部门id ：deid
                 graid.empty();
                 graid.append('<option value="0" selected>请选择里程碑</option>');
                 $.each(data,function(id,option){
                     html  = '<option value="'+option.id+'"';
                     var hidGraObj = $("#" + hid_gra);
                     if(!(hid_gra == null || hid_gra == '')){
                         if (hidGraObj.val() == option.id){
                             html += ' selected';
                         }
                     }
                     html += '>'+ option.name +'</option>';
                     graid.append(html);
                     });
                 graid.change();
                }, "json");

         });
        if($('#'+id_pro).find('option:selected').val() != 0 & $('#'+id_sta).find('option:selected').val() != 0){
            $('#'+id_sta).change();
        }
    },
    /**
     * 根据部门查询账户列表
     * editor：ys 2014-8-8
     * prarm:depid：部门下拉框id
     *       uid：账户下拉框id
     *       hidUser：账户hidden标签，可以为null或者""
            ismain:是否查询主岗，1 查主岗，0 查兼职， 2查所有
            mes: 文字描述
     */
    'projectToMember': function(proid,mid,hidMember){
        $('#'+ proid).bind('change',function(){
            var proId = $('#'+ proid).find('option:selected').val();
            $.post('/pm/task/get_member_by_project/',{ "pro_id": proId }, function(data){
                var member_id = $('#'+ mid);//账户id ：user_id
                member_id.empty();
                member_id.append('<option value="0" selected>请选择负责人</option>');
                $.each(data,function(id,option){
                    html = '<option value="'+ option.id +'"';
                    var hidMemberObj = $("#" + hidMember);
                    if(!(hidMember == null || hidMember == '')){
                        if (hidMemberObj.val() == option.id){
                            html += ' selected';
                        }
                    }
                    html += '>' + option.name + '</option>';
                    member_id.append(html);
                    });
                member_id.change();
                }, "json");
        });
            $('#'+ proid).change();
    },
    /**
     * 根据部门查询账户列表
     * editor：ys 2014-8-8
     * prarm:depid：部门下拉框id
     *       uid：账户下拉框id
     *       hidUser：账户hidden标签，可以为null或者""
            ismain:是否查询主岗，1 查主岗，0 查兼职， 2查所有
            mes: 文字描述
     */
    'gradeToTask': function(gid,tid,hidTask){
        $('#'+ gid).bind('change',function(){
            var gId = $('#'+ gid).find('option:selected').val();
            $.post('/pm/task/get_task_by_grade/',{ "gra_id": gId }, function(data){
                var task_id = $('#'+ tid);//账户id ：user_id
                task_id.empty();
                task_id.append('<option value="0" selected>请选择任务</option>');
                $.each(data,function(id,option){
                    html = '<option value="'+ option.id +'"';
                    var hidTaskObj = $("#" + hidTask);
                    if(!(hidTask == null || hidTask == '')){
                        if (hidTaskObj.val() == option.id){
                            html += ' selected';
                        }
                    }
                    html += '>' + option.name + '</option>';
                    task_id.append(html);
                    });
                task_id.change();
                }, "json");
        });
            $('#'+ gid).change();
    },

    'deptypeToWtype': function(dtid,tid,hidWorkType){
        $('#'+ dtid).bind('change',function(){
            var dtId = $('#'+ dtid).find('option:selected').val();
            $.post('/hrm/employee/get_wtype',{ "dt_id": dtId }, function(data){
                var worktype = $('#'+ tid);
                worktype.empty();
                worktype.append('<option value="0" selected>请选择</option>');
                $.each(data,function(id,option){
                    html = '<option value="'+ option.id +'"';
                    var hidWorkTypeObj = $("#" + hidWorkType);
                    if(!(hidWorkType == null || hidWorkType == '')){
                        if (hidWorkTypeObj.val() == option.id){
                            html += ' selected';
                        }
                    }
                    html += '>' + option.name + '</option>';
                    worktype.append(html);
                    });
                worktype.change();
                }, "json");
        });
            $('#'+ dtid).change();
    },
    'WtypeToGrade': function(wtid,gid,hidGrade){
        $('#'+ wtid).bind('change',function(){
            var wtId = $('#'+ wtid).find('option:selected').val();
            console.log($("#"+hidGrade).val());
            $.post('/hrm/employee/archives/get_grade_by_wtype',{ "wt_id": wtId }, function(data){
                var grade = $('#'+ gid);
                grade.empty();
                grade.append('<option value="0" selected>请选择</option>');
                $.each(data,function(id,option){
                    html = '<option value="'+ option.id +'"';
                    var hidGradeObj = $("#" + hidGrade);
                    if(!(hidGrade == null || hidGrade == '')){
                        if (hidGradeObj.val() == option.id){
                            html += ' selected';
                        }
                    }
                    html += '>' + option.name + '</option>';
                    grade.append(html);
                    });
                grade.change();
                }, "json");
        });
            $('#'+ wtid).change();
    }
};