
var current_path = $(location).attr('pathname');

/**
 * 列表排序
 * @param get_vars  后台传过来的
 * @param element 选择器
 */
var list_order = function(element,get_vars){
    $(element).bind('click',function(){
        var v = $(this).find('img');
        var id = $(this).closest(".cursor_p").attr("id");
        if(v.attr('src') == '/images/disable.png'){
            v.attr('src', '/images/order_desc.png');
            location.href = current_path + "?order=-" + id + get_vars //'{{ getvars }}'
        }
        else if(v.attr('src') == '/images/order_desc.png'){
            v.attr('src', '/images/order_asc.png');
            location.href = current_path + "?order=" + id + get_vars //'{{ getvars }}'
        }
        else {
            v.attr('src', '/images/order_asc.png');
            location.href = current_path + "?order=-" + id + get_vars //'{{ getvars }}'
        }
    });
}

/**
 * 页面加载排序图标
 * @param element 排序列的class
 * @param order 后台传过来的
 */
var order_pic = function(element,order){
    $(element).each(function(){
        var orders = order.split(",");
        for(var i=0; i<orders.length; i++) {
            var is_desc = false;
            if (orders[i].indexOf("-") != -1){
                is_desc = true;
                orders[i] = orders[i].substring(1,orders[i].Length);
            }
            if ($(this).attr("id") == orders[i]){
                if (is_desc){
                    $(this).find('img').attr('src', '/images/order_desc.png');
                }else{
                    $(this).find('img').attr('src', '/images/order_asc.png');
                }
            }else{
                $(this).find('img').attr('src', '/images/disable.png');
            }
        }
    });
}

/**
 * 选择每页显示多少条数据触发的事件
 * @param id_element  下拉框的id
 */
var page_nums = function(id_element){
    $('#'+id_element).bind('change',function(){
        var num_per_page = $(this).val();
        location.href = current_path + '?num_per_page=' + num_per_page + '&search=0';
    });
}

/**
 * 在文本框中输入第几页触发的事件
 * @param id_element  文本框的id
 * @param max_page   最大页数
 */
var page_current = function(id_element,max_page){
    $('#'+id_element).bind('change',function(){
        var current_page = $(this).val();
        var search_query = $(this).attr("rel");
        //var max_page = "{{ paginator.num_pages }}"
        if(parseInt(current_page) > max_page){
            current_page = max_page;
        }
        if(parseInt(current_page) < 1){
            current_page = 1;
        }
        location.href = current_path + '?page=' + current_page + search_query;
    });
}

/**
 * 根据隐藏字段控制table的显示
 * @param table_class  table的class
 * @param hidden_string  隐藏的字段
 */
var hidden_table_width = function(table_class, hidden_string){
    var hidden_list = [];

    for (var i=0; i<hidden_string.split(",").length; i++){
        if(hidden_string.split(",")[i] != ''){
            hidden_list.push(hidden_string.split(",")[i]);
        }
    }

    if(hidden_list.length > 0){
        $(table_class).hidefield(hidden_list);
        $("div .head").hidefield(hidden_list);
        resizetitle.call(document.getElementById('table_list'));
        $('.solidline').css('width', $(table_class).width());
        //$('.main_list_nav_fixed').css('width', $('.main_list_table_poi').width());
        $('#main_list_nav').css('width', $(table_class).width());
    }
}


/**
 * 编辑显示列按钮的点击事件
 * @param button_id   按钮的id
 */
var custom_hide_button = function(button_id){
    $('#'+button_id).bind('click',function(){
        $('.main_list_addhabi').show();
        $('.main_list_custom').hide();
        $('.main_list_custom:last').show();
    });
}

/**
 * 显示隐藏列弹出框中保存按钮的点击事件
 * @param savebtn_id  保存按钮的id
 */
var custom_hide_save = function(savebtn_id){
    $("#"+savebtn_id).bind('click',function(){
        var reight_user = $("#edit_hidden_list").attr("rel");
        var hide_field = $.cloud_checkbox.get_checked_val("cnadidate_hide_check");
        $.post('/tools/parse_personal_hide/', {'hide_field':hide_field, 'reight_user':reight_user}, function(html){
            if(html == "1"){
                location.href = current_path;
            }
        })
    });
}


/**
 * 添加搜索习惯按钮的点击事件
 * @param button_id  按钮id
 */
var custom_search_button = function(button_id){
    $('#'+button_id).bind('click',function(){
        $('.main_list_addhabi').show();
        $('.main_list_custom').hide();
        $('.main_list_custom:first').show();
    });
}


/**
 * 保存搜索习惯按钮的点击事件
 * @param savebtn_id   保存按钮的id
 */
var custom_search_save = function(savebtn_id){
    $("#"+savebtn_id).bind('click',function(){
        var search_name = $("#search_name").val();
        if(search_name == ''){
            $('.main_list_errtext').html('*请填写搜索习惯名称');
            return false;
        }
        var html = $("#edit_custom_search").html();
        var selected_query = $.cloud_checkbox.get_checked_val("cnadidate_search_check");
        if(selected_query == ''){
            $('.main_list_errtext').html('*请选择搜索习惯');
            return false;
        }
        $.post('/tools/parse_personal_search/', {'selected_query':selected_query, 'search_name':search_name, 'html':html}, function(html){
            location.href = current_path;
        })
    });
}


/**
 * 选择某个搜索习惯时触发的事件
 * @param habit_class   搜索习惯div的class
 */
var choose_habit = function(habit_class){
    $('.'+habit_class).click(function(){
        var id = $(this).attr('id');
        $.ajax({
            url : '/tools/get_search_item/',
            async : false, // 注意此处需要同步，因为返回完数据后，下面才能让结果的第一条selected
            type : "POST",
            data : {'id':id},
            success : function(html) {
                $('.main_list_search_detail').html(html);
                $('select').select2();
                $('.select2-container .select2-choice div b').css('background-image', 'url(/images/greyarrow.png)');
            }
        });

        $("#set_num_per_page").val($("#num_per_page").val());

        $('.main_list_habit_btn').css({
            'border-bottom' : '1px  solid #146895',
            'height' : 24
        });
        $('.main_list_seqline').hide();

        $(this).css({
            'border-bottom' : 0,
            'height' : 26
        });
        $(this).find('.main_list_seqline').show();
        $('.main_list_search_detail').show();
        $('.main_list_search_pane').css('height', $('.main_list_nav_fixed').height());
        // $('#abs_tr').css('top', ylen + 50 + $('#abs1').height());
        choicepage();
    });
}


/***
 * 当用户有搜索习惯，并且用搜索习惯搜索刷新页面时返回当前页，要把搜索参数重新渲染会页面中
 * @param current_search  用户自定义搜索的id
 */
var custom_search_context = function(current_search){
    if (current_search != 0 && current_search != '搜索'){
        $.ajax({
            url : '/tools/get_search_item/',
            async : false, // 注意此处需要同步，因为返回完数据后，下面才能让结果的第一条selected
            type : "POST",
            data : {'id':current_search},
            success : function(html) {
                $('.main_list_search_detail').html(html);
                $('select').select2();
                $('.select2-container .select2-choice div b').css('background-image', 'url(/images/greyarrow.png)');
            }
        });

        $("#set_num_per_page").val($("#num_per_page").val());

        $('.main_list_habit_btn').css({
            'border-bottom' : '1px  solid #146895',
            'height' : 24
        });
        $('.main_list_seqline').hide();

        $(this).css({
            'border-bottom' : 0,
            'height' : 26
        });
        $(this).find('.main_list_seqline').show();
        $('.main_list_search_detail').show();
        $('.main_list_search_pane').css('height', $('.main_list_nav_fixed').height());
        // $('#abs_tr').css('top', ylen + 50 + $('#abs1').height());
    }
}

/**
 * 删除搜索习惯
 * @param btn_id  删除按钮的id
 */
var search_delete = function(btn_id){
    $("#"+btn_id).bind('click',function(){
        var id = $("#h_search").val();
        $.ajax({
            url: "/tools/delete_personal_search/",
            type: "POST",
            data: {"id": id},
            dataType: "JSON",
            success: function(data){
                location.reload();
            }
        });

    });
}

/**
* 获取easyui列表的自定义搜索弹出层
* @param btn_id  删除按钮的id
*/
var load_search_form = function(right_id, right_url){
    $.ajax({
        url: right_url,
        dataType: "html",
        async:false,
        data:  {'right_id':right_id},
        type: "POST",
        success: function(data) {
            if(data != '0'){
                $('#w').html(data);
            }else{
                $('#w').html("后台获取数据错误，无法显示表单");
            }
            $('#w').window('open');
        }
    });
}

/**
* 获取easyui列表控制子权限的可用于不可用
* @param btn_id  删除按钮的id
*/
var display_right = function(select_num){
    if(select_num == 0){
        $(".right_item").each(function(){
            if($(this).attr("id") == '10'){
                $(this).removeClass("th_nav_unselected");
                $(this).addClass("th_nav");
                $(this).attr("onclick", "return true");
            }else{
                $(this).removeClass("th_nav");
                $(this).addClass("th_nav_unselected");
                $(this).attr("onclick", "return false");
            }
        })
    }else if (select_num == 1){
        $(".right_item").each(function(){
            if($(this).attr("id") == '10' || $(this).attr("id") == '11' || $(this).attr("id") == '13'){
                $(this).removeClass("th_nav_unselected");
                $(this).addClass("th_nav");
                $(this).attr("onclick", "return true");
            }else{
                $(this).removeClass("th_nav");
                $(this).addClass("th_nav_unselected");
                $(this).attr("onclick", "return false");
            }
        })
    }else if (select_num > 1){
        $(".right_item").each(function(){
            if($(this).attr("id") == '10' || $(this).attr("id") == '13' || $(this).attr("id") == '15'){
                $(this).removeClass("th_nav_unselected");
                $(this).addClass("th_nav");
                $(this).attr("onclick", "return true");
            }else{
                $(this).removeClass("th_nav");
                $(this).addClass("th_nav_unselected");
                $(this).attr("onclick", "return false")
            }
        })
    }
}


var search_data = function(param_list, path){
    var search_string = ''
    for (var i=0; i<param_list.length; i++ ){
        var param_item = $("#" + param_list[i]).val();
        if (i==0){
            search_string += '?' + param_list[i] + '=' + param_item
        }else{
            search_string += '&' + param_list[i] + '=' + param_item
        }
    }

    var pager = $('#dg').datagrid({
        onLoadSuccess: function(data){//加载数据成功后的回调函数
            path = data.path;
            $(".pagination-num").val(data.page);
            for(var i=0; i<data.param.length; i++){
                var key = data.param[i][0];
                var value = data.param[i][1];
                $("#"+key).val(value);
            };

            var str = '';
            if($("#my_rights").children().length <= 1){
                for(var i=0; i<data.apps.length; i++){
                    if(data.apps[i][2] == '10'){
                        str += '<a class="th_nav right_item" href="' + data.apps[i][1] + '" rel="' + data.apps[i][1] + '" id="' + data.apps[i][2] + '">' + data.apps[i][0] + '</a>';
                    }else{
                        str += '<a class="th_nav_unselected right_item" href="' + data.apps[i][1] + '" rel="' + data.apps[i][1] + '" id="' + data.apps[i][2] + '" onclick="return false">' + data.apps[i][0] + '</a>';
                    }
                };
            }
            $("#my_rights").append(str);

            var str = '';
            if($("#customer_search_list").children().length <= 1){
                for(var i=0; i<data.search.length; i++){
                    str += '<div class="habit_btn" id="'+ data.search[i][0] +'">' + data.search[i][1] + '<div class="main_list_seqline"></div></div>';
                };
            }
            $("#customer_search_list").prepend(str);

            $(".datagrid-header-check input").addClass("select_all");
        },
        url: path + search_string
    }).datagrid('getPager');
}