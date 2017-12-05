$(function () {
    $("#user").click();
})

/**
 * 1.查询面试人员
 */
$("#user").click(function () {
    to_page(1);
});
/**
 * 2.查询题库录入
 */
$("#que").click(function () {
    showInputQues();
});

// 模态框初始化
$("#choiceModal").on("hidden.bs.modal", function () {
    $("input").val("");
    $("select").val("");
    $("textarea").val("");
    $("#des").parent().parent().nextAll().remove();
});

// 插入试题
$("#type").change(function () {
    $("#des").parent().parent().nextAll().remove();
    var divO = $("<div></div>").addClass("form-group");
    var divI = $("<div></div>").addClass("col-md-8");
    var labelO = $("<label></label>").addClass("col-md-2 control-label").append("选项");
    var divOa = $("<div></div>").addClass("form-group");
    var divIa = $("<div></div>").addClass("col-md-8");
    var labelA = $("<label></label>").addClass("col-md-2 control-label").append("答案");
    var type = $("#type").val();

    if (type != "") {
        if (type == 0) {
            var A = $("<input>").addClass("form-control").attr("name", "optionsList[0]").attr("placeholder", "选项...");
            var B = $("<input>").addClass("form-control").attr("name", "optionsList[1]").attr("placeholder", "选项...");
            var C = $("<input>").addClass("form-control").attr("name", "optionsList[2]").attr("placeholder", "选项...");
            var D = $("<input>").addClass("form-control").attr("name", "optionsList[3]").attr("placeholder", "选项...");
            divI.append(A).append(B).append(C).append(D);
            divO.append(labelO).append(divI).appendTo($("#inputForm"));
            var answer = $("<input>").addClass("form-control").attr("name", "answerList[0]");
            divIa.append(answer);
            divOa.append(labelA).append(divIa).appendTo($("#inputForm"));
        }
        if (type == 1) {
            var answer = $("<input>").addClass("form-control").attr("name", "answerList[0]");
            divIa.append(answer);
            divOa.append(labelA).append(divIa).appendTo($("#inputForm"));
        }
        if (type == 2) {
            var answer = $("<textarea></textarea>").addClass("form-control").css("resize", "none").css("overflow", "visible")
                .attr("name", "answerList[0]").attr("row", "5");
            divIa.append(answer);
            divOa.append(labelA).append(divIa).appendTo($("#inputForm"));
        }
        if (type == 3) {
            var n = 1, m = 4;
            var A = $("<input>").addClass("form-control").attr("name", "optionsList[0]").attr("placeholder", "选项...");
            var B = $("<input>").addClass("form-control").attr("name", "optionsList[1]").attr("placeholder", "选项...");
            var C = $("<input>").addClass("form-control").attr("name", "optionsList[2]").attr("placeholder", "选项...");
            var D = $("<input>").addClass("form-control").attr("name", "optionsList[3]").attr("placeholder", "选项...");
            var spanO = $("<span></span>").addClass("glyphicon glyphicon-plus").css("float", "right").attr("id", "addSpanO");
            var spanA = $("<span></span>").addClass("glyphicon glyphicon-plus").css("float", "right").attr("id", "addSpanA");
            spanO.on("click", function () {
                spanO.before($("<input>").addClass("form-control").attr("name", "optionsList[" + m + "]").attr("placeholder", "选项..."));
                m++;
            });
            spanA.on("click", function () {
                spanA.before($("<input>").addClass("form-control").attr("name", "answerList[" + n + "]"));
                n++;
            });
            divI.append(A).append(B).append(C).append(D).append(spanO);
            divO.append(labelO).append(divI).appendTo($("#inputForm"));
            var answer = $("<input>").addClass("form-control").attr("name", "answerList[0]");
            divIa.append(answer).append(spanA);
            divOa.append(labelA).append(divIa).appendTo($("#inputForm"));
        }
    }
});

// 暂存试题
$("#saveQue").click(function () {
    // var formdata = decodeURIComponent($("#inputForm").serializeObject(), true);
    var formdata = JSON.stringify($("#inputForm").serializeObject());
    $.ajax({
        url: "/inputQue",
        type: "POST",
        data: {"json": formdata},
        success: function (data) {
            // 隐藏模态框
            $("#choiceModal").modal("hide");
            showInputQues();
        },
        error: function () {
            alert("插入失败,请重试!");
        }
    });
});

// 显示新增试题
function showInputQues() {
    // 初始化
    $("#queTab tr:first").nextAll().remove();
    $.ajax({
        url: "/showInputQues",
        type: "POST",
        success: function (data) {
            if (data != "") {
                $.each(data, function (index, inputQue) {
                    var tr = $("<tr></tr>");
                    $("<td></td>").append(index).appendTo(tr);
                    $("<td></td>").append(inputQue.post).appendTo(tr);
                    $("<td></td>").append(inputQue.type).appendTo(tr);
                    $("<td></td>").append(inputQue.title).appendTo(tr);
                    $("<td></td>").append($("<a></a>").append("查看")).appendTo(tr);
                    $("#queTab").append(tr);
                });
            } else {
                var tr = $("<tr></tr>").css("text-align", "center");
                $("<td></td>").append("暂时还没有插入新的试题").attr("colspan", "5").appendTo(tr);
                $("#queTab").append(tr);
            }
        }
    });
}

// 时间戳 转为 年月日
function turnTime(da) {
    da = new Date(da);
    var year = da.getFullYear();
    // 月份在 JS 中是从0开始的
    var month = da.getMonth() + 1;
    var day = da.getDate();
    var hour = da.getHours();
    var min = da.getMinutes();
    return [year, month, day].join("-") + " " + [hour, min].join(":");
}

// form 转 json
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// 显示某一分页
function to_page(pn) {
    $.ajax({
        url: "/getUsers",
        data: "pn=" + pn,
        type: "GET",
        success: function (result) {
            if (result != "") {
                // alert(result.number);
                $("#userTab").empty();
                // 1.解析并显示用户数据
                build_user_table(result);
                // 2.解释并显示分页信息
                build_page_info(result);
                // 3.解释并显示分页条数据
                build_page_nav(result);
            } else {
                var tr = $("<tr></tr>").css("text-align", "center");
                $("<td></td>").append("暂时还没有面试人员的信息").attr("colspan", "8").appendTo(tr);
                tab.append(tr);
            }

        }
    });
}

// 2.处理分页信息
function build_page_info(result) {
    // 显示数据前先清空元素内容
    $("#page_info_area").empty();
    // 显示分页信息
    $("#page_info_area").append("第" + (result.number + 1 ) + "页，共" +
        result.totalPages + "页，总" + result.totalElements + "条记录");
    // 根据参数合理化，可以直接跳转到总记录数->最后一页
}

// 显示试题模板
function show_template(paper) {
    var n = 1;
    // 处理显示选择题
    $.each(paper.choiceList, function (index, choice) {
        $("#three").append(item_template((n++) + "、" + choice.queBank.title, choice.queBank.queId, choice.queBank.des));
    });
    // 处理显示多选题
    $.each(paper.choicesList, function (index, choices) {
        $("#three").append(item_template((n++) + "、" + choices.queBank.title, choices.queBank.queId, choices.queBank.des));
    });
    // 处理显示判断题
    $.each(paper.judgeList, function (index, judge) {
        $("#three").append(item_template((n++) + "、" + judge.title, judge.queId, judge.des));
    });
    // 处理显示简答题
    $.each(paper.shortList, function (index, short) {
        $("#three").append(item_template((n++) + "、" + short.title, short.queId, short.des));
    });

}

// 处理分页条，并添加相关的动作
function build_page_nav(result) {
    // 显示数据前先清空元素内容
    $("#page_nav_area").empty();
    // BootStrap 提供的分页模板：nav>ul>li
    var ul = $("<ul></ul>").addClass("pagination");
    // 首页
    var first = $("<li></li>").append($("<a></a>").append("首页").attr("href", "#"));
    // 上一页
    var prePage = $("<li></li>").append($("<a></a>").append("&laquo;").attr("href", "#"));
    // 是否存在上一页
    if (result.first == true) {
        first.addClass("disabled");
        prePage.addClass("disabled");
    } else {
        // first、prePage、nextPage 和last 的 click 方法都会通过合理化参数(reasonable)插件拦截器
        first.click(function () {
            to_page(1);
        });
        prePage.click(function () {
            to_page(result.number);
        });
    }
    var nextPage = $("<li></li>").append($("<a></a>").append("&raquo;").attr("href", "#"));
    var last = $("<li></li>").append($("<a></a>").append("尾页").attr("href", "#"));
    // 是否还存在下一页
    if (result.last == true) {
        nextPage.addClass("disabled");
        last.addClass("disabled");
    } else {
        last.click(function () {
            to_page(result.totalPages);
        });
        nextPage.click(function () {
            to_page((result.number + 2));
        });
    }
    // 添加首页和前一页
    ul.append(first).append(prePage);

    // // 遍历添加页码
    for (var n = 1; n <= result.totalPages; n++) {
        var num = $("<li></li>").append($("<a></a>").append(n));
        // 当前显示的页码成高亮显示
        if (result.number == (n - 1)) {
            num.addClass("active");
        }
        num.click(function () {
            to_page($(this).children().text());
        });
        ul.append(num);
    }
    // 添加后一页和尾页
    ul.append(nextPage).append(last);
    $("<nav></nav>").append(ul).appendTo("#page_nav_area");

}

// 显示员工信息
function build_user_table(result) {
    var tab = $("#userTab");
    var head = $("<tr></tr>");
    $("<th></th>").append("姓名").appendTo(head);
    $("<th></th>").append("学校").appendTo(head);
    $("<th></th>").append("专业").appendTo(head);
    $("<th></th>").append("电话").appendTo(head);
    $("<th></th>").append("邮箱").appendTo(head);
    $("<th></th>").append("面试岗位").appendTo(head);
    $("<th></th>").append("参考分数").appendTo(head);
    $("<th></th>").append("考试用时(分)").appendTo(head);
    $("<th></th>").append("交卷时间").appendTo(head);
    $("<th></th>").append("操作").appendTo(head).attr("colspan", "2");
    tab.append(head);
    $.each(result.content, function (index, user) {
        var line = $("<tr></tr>");
        $("<td></td>").append(user.name).appendTo(line);
        $("<td></td>").append(user.school).appendTo(line);
        $("<td></td>").append(user.major).appendTo(line);
        $("<td></td>").append(user.phone).appendTo(line);
        $("<td></td>").append(user.email).appendTo(line);
        $("<td></td>").append(user.post).appendTo(line);
        $("<td></td>").append((user.choiceSumScore + user.judgeSumScore + user.choicesSumScore)).appendTo(line);
        $("<td></td>").append(user.useTime).appendTo(line);
        $("<td></td>").append(turnTime(user.doTime)).appendTo(line);
        $("<td></td>").append($("<a>查看</a>").attr("target", "_blank").attr("href", "/getUserExa?userFlag=" + user.userFlag)).appendTo(line);
        $("<td></td>").append($("<a>删除</a>").bind("click", function () {
            delete_user(user.userFlag, (result.number + 1));
        })).appendTo(line);
        tab.append(line);
    });
}

// 删除用户信息+试卷
function delete_user(uf, n) {
    var wc = window.confirm("确定要删除该用户信息吗？");
    if (wc == true) {
        $.ajax({
            url: "/deleteUser",
            type: "GET",
            data: {"userFlag": uf},
            success: function () {
                to_page(n);
            }
        });
    } else {
        return false;
    }
}

// 选择模板显示
$("#selectTemp").change(function () {
    // 初始化
    $("#selectTemp").parent().nextAll().remove();
    var optionVal = $(this).find("option:selected").val();
    if (optionVal != "") {
        $.ajax({
            url: "/getExaPaper",
            type: "GET",
            data: {"post": optionVal},
            success: function (paper) {
                show_template(paper);
                $('textarea').flexText();
            }
        });
    }
});

// item 模板
function item_template(title, queId, des) {
    var oDiv = $("<div></div>").addClass("row col-md-12");
    if (title.length > 50) {
        title = title.substring(0, 50);
    }
    var a = $("<a></a>")
        .addClass("btn btn-link")
        .attr("role", "button")
        .attr("data-toggle", "collapse").attr("aria-expanded", "false").attr("aria-controls", queId)
        .attr("href", "#" + queId).append(title);
    var iDiv = $("<div></div>").addClass("collapse").attr("id", queId);
    var operator = $("<div></div>").addClass("col-md-12 col-md-offset-10");
    var showDiv = $("<div></div>").addClass("col-md-12 well");
    if (des != "") {
        var text = $("<textarea></textarea>").val(des).attr("readonly", "readonly");
        $("<div></div>").addClass("col-md-12").append(text).appendTo(showDiv);
    }
    var editBtn = $("<Button></Button>").addClass("btn btn-primary").append("修改");
    var delBtn = $("<Button></Button>").addClass("btn btn-danger").append("删除");
    operator.append(editBtn).append(delBtn);
    showDiv.append(operator);
    iDiv.append(showDiv);
    oDiv.append(a).append(iDiv);
    $("textarea").flexText();
    return oDiv;
}