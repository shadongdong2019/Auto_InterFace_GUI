import json

from django.http import HttpResponse
from django.shortcuts import render, render_to_response
import os




def index(request):
    baseDir = os.path.dirname(os.path.abspath(__name__))
    report_path = ""
    if request.method == "POST":
        pro_name = request.POST.get("pro_name","")
        caseFile = request.FILES.get('case_file', None)  # 获取上传的文件，如果没有文件，则默认为None
        configFile = request.FILES.get('config_file', None)  # 获取上传的文件，如果没有文件，则默认为None
        if not caseFile:
            return HttpResponse("no files for upload!")
        if not configFile:
            return HttpResponse("no files for upload!")
        fileDict = {
            "caseFile":caseFile,
            "configFile":configFile,
        }
        deal_file_path = pro_dir_deal(pro_name,**fileDict)  #返回测试用例文件路径，配置文件路径
        write_config_path = os.path.join(baseDir,"static/write_config/run.json") #写入配置文件
        with open(write_config_path,"wb") as f:
            f.write(json.dumps(deal_file_path,ensure_ascii=False,indent=4).encode("utf-8")) #字典转成json,字典转换成字符串 加上ensure_ascii=False以后，可以识别中文， indent=4是间隔4个空格显示
        from upload_case import case_test_common
        report_path = case_test_common.main()

    else:
        pass

    content = {
        'report_path':report_path,
    }
    return render_to_response("upload.html",content)



def upload_file(uploadFile,filePathDict):
    '''
    :param request:
    :param myFile: 文件流
    :param path: 上传文件存储路径
    :param suffix: 后缀名
    :return:
    '''
    ret_filename = ""
    try:
        for filePath in filePathDict.values():
            filename = os.path.join(filePath, uploadFile.name)
            fobj = open(filename, 'wb')# 打开特定的文件进行二进制的写操作
            for chrunk in uploadFile.chunks():  # 分块写入文件
                fobj.write(chrunk)
            fobj.close()
            if "case_file" in filePath or "config" in filePath :
                ret_filename = filename
    except Exception as e :
        ret_filename = ""
    return ret_filename


def pro_dir_deal(pro_name,**fileDict):
    deal_file_path = {}
    baseDir = os.path.dirname(os.path.abspath(__name__))
    pro_dir = ''
    filePathDict = {}
    try:

        if pro_name:
            pro_dir = os.path.join(baseDir, "InterfaceTest/project_tree/{}".format(pro_name))
            if not os.path.exists(pro_dir):
                os.makedirs(pro_dir)
                os.makedirs(os.path.join(pro_dir, "config"))
                os.makedirs(os.path.join(pro_dir, "case_file"))
                os.makedirs(os.path.join(pro_dir, "report"))

        filePath1 = os.path.join(baseDir, "static/case")
        filePathDict["filePath1"] = filePath1
        if pro_dir:
            for key  in fileDict.keys():
                if key == "caseFile":
                    filePath2 = os.path.join(pro_dir, "case_file")
                    filePathDict["filePath2"]=filePath2
                    filename = upload_file(fileDict.get(key), filePathDict)
                    deal_file_path["caseFile"] = filename
                elif key == "configFile":
                    filePath2 = os.path.join(pro_dir, "config")
                    filePathDict["filePath2"] = filePath2
                    filename = upload_file(fileDict.get(key), filePathDict)
                    deal_file_path["configFile"] = filename
                deal_file_path["report_path"] = os.path.join(pro_dir, "report")
            return deal_file_path

    except Exception as e :
        pass
    return deal_file_path

