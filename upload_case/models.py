from django.db import models


class ProjectsManage(models.Model):
    """
    描述 : 项目管理表
    作者 : majing  2019-09-26
    """
    CHOICES_STATUS = (
        (0, u'删除'),
        (100, u'停用'),
        (200, u'正常'),
    )

    p_name = models.CharField(u'项目名称', max_length=100)
    p_path = models.CharField(u'项目路径', max_length=500)

    adder = models.CharField(max_length=256, blank=True, null=True)  # (id)操作人用户名；前面应记录用户ID
    # 系统保留信息
    addtime = models.DateTimeField(auto_now_add=True, editable=False)  # 添加时间
    adderip = models.GenericIPAddressField(default='0.0.0.0')  # 添加人当前IP地址
    status = models.IntegerField(choices=CHOICES_STATUS, default=200)  # 状态；0：逻辑删除；200：正常;

    class Meta:
        db_table = 'projects_manage'


class InterfaceManage(models.Model):
    """
    描述 : 项目-接口管理表
    作者 : majing  2019-09-26
    """
    CHOICES_STATUS = (
        (0, u'删除'),
        (100, u'停用'),
        (200, u'正常'),
    )
    p_id = models.IntegerField(u'项目ID')  # 所属项目ID
    p_name = models.CharField(u'项目名称', max_length=100)  # 所属项目名称
    i_name = models.CharField(u'接口名称', max_length=100)
    p_path = models.CharField(u'接口路径', max_length=500)

    adder = models.CharField(max_length=256, blank=True, null=True)  # (id)操作人用户名；前面应记录用户ID
    # 系统保留信息
    addtime = models.DateTimeField(auto_now_add=True, editable=False)  # 添加时间
    adderip = models.GenericIPAddressField(default='0.0.0.0')  # 添加人当前IP地址
    status = models.IntegerField(choices=CHOICES_STATUS, default=200)  # 状态；0：逻辑删除；200：正常;

    class Meta:
        db_table = 'interface_manage'

class InterfaceDetails(models.Model):
    """
    描述 : 项目-接口详细信息
    作者 : majing  2019-09-26
    """
    CHOICES_STATUS = (
        (-1, u'物理删除'),
        (0, u'逻辑删除'),
        (100, u'停用'),
        (200, u'正常'),
    )
    p_id = models.IntegerField(u'项目ID')  # 所属项目ID
    p_name = models.CharField(u'项目名称', max_length=100)  # 所属项目名称
    i_id = models.IntegerField(u'接口ID',)  # 所属接口ID
    i_name = models.CharField(u'接口名称', max_length=100) # 所属接口名称
    case_path = models.CharField(u'测试用例路径', max_length=500, blank=True, null=True)
    config_path = models.CharField(u'配置文件路径', max_length=500, blank=True, null=True)
    image_path = models.CharField(u'图片路径', max_length=500, blank=True, null=True)
    needs_path = models.CharField(u'需求文档路径', max_length=500, blank=True, null=True)
    report_path = models.CharField(u'需求文档路径', max_length=500, blank=True, null=True)
    download_path = models.CharField(u'下载文件路径', max_length=500, blank=True, null=True)

    adder = models.CharField(max_length=256, blank=True, null=True)  # (id)操作人用户名；前面应记录用户ID
    # 系统保留信息
    addtime = models.DateTimeField(auto_now_add=True, editable=False)  # 添加时间
    adderip = models.GenericIPAddressField(default='0.0.0.0')  # 添加人当前IP地址
    status = models.IntegerField(choices=CHOICES_STATUS, default=200)  # 状态；0：逻辑删除；200：正常;

    class Meta:
        db_table = 'interface_details'


# class ApplyFormalAudit(models.Model):
#     """
#     描述 : 员工转正审核模型
#     作者 : lishiyin  2013-7-19
#     """
#     apply_formal = models.ForeignKey(ApplyFormal, verbose_name=u'转正申请', on_delete=models.PROTECT)
#     unit_id = models.IntegerField(u'机构', max_length=10, blank=True, null=True)  # 机构ID
#     depart_id = models.IntegerField(u'部门', max_length=10, blank=True, null=True)  # 部门ID
#     depname = models.CharField(u'部门名称', max_length=20, blank=True, null=True)
#     checker = models.ForeignKey(Users, verbose_name=u'审核人', on_delete=models.PROTECT)
#     remark = models.CharField(u'审核批注', max_length=150, blank=True, null=True)
#     audit_time = models.DateTimeField(u'审核时间', blank=True, null=True)
#     check_status = models.IntegerField(u'审核状态', choices=tools.CHOICES_APPLYFORMAL_STATUS, default=0)
#
#     adder = models.CharField(max_length=256, blank=True, null=True)  # (id)操作人用户名；前面应记录用户ID
#     # 系统保留信息
#     addtime = models.DateTimeField(auto_now_add=True, editable=False)  # 添加时间
#     adderip = models.IPAddressField(default='0.0.0.0')  # 添加人当前IP地址
#     status = models.IntegerField(choices=tools.CHOICES_STATUS, default=200)  # 状态；0：逻辑删除；200：正常;
#
#     class Meta:
#         db_table = 'users_apply_formal_audit'
#
#
# class WrongSalary(models.Model):
#     """
#     描述 : 员工薪资异议模型
#     作者 : Liye  2014-07-22
#     """
#
#     CHOICES_AUDIT_MNG = (
#         (0, u'未处理'),
#         (1, u'审核通过'),
#         (2, u'审核拒绝')
#     )
#
#     person = models.ForeignKey(Persons, verbose_name=u'薪资异议员工', blank=True, null=True)
#     salary_money = models.DecimalField(u'员工异议薪资', max_digits=18, decimal_places=2, default=0)
#     remark = models.TextField(u'异议理由', blank=True, null=True)  # 申请理由
#     # 申请人信息
#     un_id = models.IntegerField(u'机构ID', blank=True, null=True)
#     un_name = models.CharField(u'机构名称', max_length=100, blank=True, null=True)
#     ad_id = models.IntegerField(u'申请人ID', blank=True, null=True)
#     ad_name = models.CharField(u'申请人姓名', max_length=20, blank=True, null=True)
#     de_id = models.IntegerField(u'申请人部门ID', blank=True, null=True)
#     de_name = models.CharField(u'申请人部门名称', max_length=100, blank=True, null=True)
#     time = models.CharField(u'结转月', max_length=20, blank=True, null=True)  # 结转月
#     year = models.CharField(u'结转年', max_length=20, blank=True, null=True)  # 结转年
#     path = models.FileField(u'上传图片', upload_to='/', blank=True, null=True, help_text=u'只能上传jpg文件')  # 只能上传jpg文件
#
#     # 审核人
#     audit_state = models.IntegerField(u'审核状态', choices=CHOICES_AUDIT_MNG, blank=True, null=True)  # 审核人id
#     auditor = models.IntegerField(u'审核人id', blank=True, null=True)  # 审核人user id
#     auditor_name = models.CharField(u'审核人姓名', max_length=100, blank=True, null=True)  # 审核人姓名
#     audit_time = models.DateTimeField(u'审核时间', blank=True, null=True)  # 审核时间
#     audit_remark = models.TextField(u'审核批注', blank=True, null=True)  # 审核批注
#
#     # 系统保留信息
#     addtime = models.DateTimeField(auto_now_add=True, editable=False, blank=True, null=True)  # 添加时间
#     mouth = models.CharField(u'提报月', max_length=20, blank=True, null=True)  # 提报月
#     adderip = models.IPAddressField(default='0.0.0.0', blank=True, null=True)  # 添加人当前IP地址
#     status = models.IntegerField(choices=tools.CHOICES_STATUS, default=200)  # 状态；0：逻辑删除；200：正常;
#
#     class Meta:
#         db_table = 'wrong_salarys'



