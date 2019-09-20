import sys
import datetime
import random
import string
from InterfaceTest.python_excel import log
import os
import unittest
import ddt

from InterfaceTest.python_excel.common.CaseIsPass import CaseIsPass
from InterfaceTest.python_excel.common.interface_run import InterfaceRun
from InterfaceTest.python_excel.common.deal_response_data import DealResData
from InterfaceTest.python_excel.HTMLTestRunner import HTMLTestRunner
from copy import deepcopy
import json
import  pprint
from InterfaceTest.python_excel.common.cmp_res_req import CmpReqRes
import time
import logging
from InterfaceTest.python_excel.utils.operation_cfg import OperationCFG
from InterfaceTest.python_excel.get_data.common_param_dic import CommonParamDict
from InterfaceTest.python_excel.get_data.dependCase import DependCase
from InterfaceTest.python_excel.utils.operation_json import OperationJson

mylog = logging.getLogger(__file__)
baseDir = os.path.dirname(os.path.abspath(__name__))
run_config =os.path.join(baseDir,'static/write_config/run.json')#上传文件后写入的配置文件路径
ope_json = OperationJson(run_config)
pro_config = ope_json.get_data_for_key("configFile")#获取项目配置文件路径
pro_case = ope_json.get_data_for_key("caseFile")#获取项目测试用例文件路径
pro_rep_path = ope_json.get_data_for_key("report_path")#获取项目测试报告存储路径
ope_cfg = OperationCFG(pro_config,"my_case_file")
option_dict = ope_cfg.get_config_dict()
if pro_case:
    filename = pro_case
else:
    filename = option_dict["case_filepath"]

if pro_rep_path:
    reportpath = pro_rep_path
else:
    reportpath = option_dict["report_path"]

sheetid_http = int(option_dict["case_sheetid"])
start= int(option_dict["case_start_rownum"])
end= int(option_dict["case_end_rownum"])

cpd = CommonParamDict(**option_dict)
data_http = cpd.deal_param()

@ddt.ddt
class CaseRun(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        pass
    @classmethod
    def tearDownClass(self):
        pass
    def setUp(self):
        self.interface_run = InterfaceRun()
        self.deal_res_data = DealResData()
        #self.op_excel = OperationExcel(**option_dict)
        self.method_req = "post"
        self.crr = CmpReqRes(**option_dict)
        self.cp = CaseIsPass(**option_dict)
    def tearDown(self):
        pass

    @ddt.data(*data_http)
    def test_apply_http(self,data_dict):
        '''
        测试数据={0}
        :param data_dict:
        :return:
        '''
        pp = pprint.PrettyPrinter(indent=4)

        #获取请求不传入参数列表
        no_request_list = cpd.param.get_param_no_request_list()
        no_request_dict = {} #存放不参数请求的参数
        #深拷贝参数字典
        req_data_dict = deepcopy(data_dict)
        if str(req_data_dict.get("IsDepend","")).lower() == "yes": #是否需要先执行依赖测试用例
            dep_case = DependCase(req_data_dict,option_dict)
            update_data = dep_case.get_dep_data()
            for data  in update_data.keys():
                req_data_dict[data] = update_data[data]


        if req_data_dict.get("Requrl", None):
            url = req_data_dict.pop("Requrl")
        else:
            url = option_dict["Requrl"]
        for param  in no_request_list:
            no_request_dict[param] = req_data_dict.pop(param)
        req_s_time = time.time()
        ori_res = self.interface_run.main_request(self.method_req, url, req_data_dict)
        req_e_time = time.time()
        hs = req_e_time -req_s_time
        try:
            res = ori_res.json()
        except Exception as e:
            res = ori_res.text
        pp.pprint("{}用例执行详情如下：".format(option_dict.get("interface_name","")))
        pp.pprint("{}执行测试用例编号：[{}]".format(option_dict.get("interface_name",""),no_request_dict["CaseID"]))
        pp.pprint("{}测试目的：{}".format(option_dict.get("interface_name",""),no_request_dict["TestTarget"]))
        pp.pprint("{}用例描述：{}".format(option_dict.get("interface_name",""),no_request_dict["CaseDesc"]))
        pp.pprint("{}地址：{}".format(option_dict.get("interface_name",""),url))
        pp.pprint("{}预期返回值={}".format(option_dict.get("interface_name",""),no_request_dict["ExpectValue"]))
        pp.pprint("{}预期回调状态值={}".format(option_dict.get("interface_name",""),no_request_dict["ExpCallbackFlag"]))
        pp.pprint("******************************************************************************")
        pp.pprint("请求参数={}".format(json.dumps(req_data_dict, ensure_ascii=False)))
        pp.pprint("******************************************************************************")
        pp.pprint("{}响应返回数据共<{}>条".format(option_dict.get("interface_name",""),len(res.get("data",""))))
        pp.pprint("{}响应结果={}".format(option_dict.get("interface_name",""),res))
        pp.pprint("{}响应耗时：{}".format(option_dict.get("interface_name",""),hs))


        kargs = {
                 "option_dict":option_dict,
                 "expect":no_request_dict["ExpectValue"],
                 "res":ori_res,
                 "req":req_data_dict,
                 "partnerID":req_data_dict.get("partnerID"),
                 "partnerKey":req_data_dict.get("partnerKey"),
                 "expCallbackFlag":no_request_dict["ExpCallbackFlag"],
                 "no_verify_filed":option_dict.get("no_verify_filed",None) #数据库中无需验证字段
        }
        start = time.time()
        verify_res = self.crr.verify_is_pass(**kargs)
        end =time.time()
        hs = end -start
        pp.pprint("{}响应结果验证耗时：{}".format(option_dict.get("interface_name",""),hs))

        is_pass = self.cp.case_is_pass(**verify_res)

        self.assertTrue(is_pass,"测试用例执行未通过")

def main():

    cr =CaseRun()
    run_file = sys.argv[0]
    run_file_name = os.path.basename(os.path.splitext(run_file)[0])
    rand_str = ''.join(random.sample((string.ascii_letters + string.digits), 5))
    data_str = datetime.datetime.now().strftime('%Y%m%d')
    report_name = run_file_name+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.html'
    report_path = os.path.join("{}/{}/".format(reportpath,data_str),report_name)
    path = os.path.join("{}/{}/".format(reportpath,data_str))
    if not os.path.exists(path):
        os.makedirs(path)
    fp = open(report_path,'wb')
    suite = unittest.TestLoader().loadTestsFromTestCase(CaseRun)
    title = '{}-{}-{}测试报告（{}）'.format(option_dict.get("project_name"),option_dict.get("run_environment"),option_dict.get("interface_name"),option_dict.get("call_method"))
    description = "{0}-测试用例-验证合法参数请求成功及非法参数请求失败".format(option_dict.get("interface_name",""))
    runner = HTMLTestRunner.HTMLTestRunner(stream=fp,title=title,description=description,verbosity=2)
    runner.run(suite)
    return report_path