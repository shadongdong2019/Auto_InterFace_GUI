import datetime
import json

from django.http import HttpResponse
from django.shortcuts import render, render_to_response
import os
from pathlib import Path



def index(request):
    baseDir = os.path.dirname(os.path.abspath(__name__))
    show_path = ""
    file_down = ""
    report_path = ""
    pro_name = ""
    caseFile = ""
    configFile = ""
    if request.method == "POST":
        pro_name = request.POST.get("pro_name","")
        caseFile = request.FILES.get('case_file', '')  # 获取上传的文件，如果没有文件，则默认为''
        configFile = request.FILES.get('config_file', '')  # 获取上传的文件，如果没有文件，则默认为''
        case_file_path = os.path.join(baseDir,"InterfaceTest/static/project_tree/{}/case_file/{}".format(pro_name,caseFile))
        config_file_path = os.path.join(baseDir,"InterfaceTest/static/project_tree/{}/config/{}".format(pro_name, configFile))
        deal_file_path ={}
        if not caseFile and not os.path.isfile(case_file_path): #get_dir_file
            if get_dir_file(case_file_path):
                case_file_path = case_file_path+get_dir_file(case_file_path)[0]
                deal_file_path["caseFile"] = case_file_path
            else:
                return HttpResponse("no files for upload!")
        if not configFile and not os.path.isfile(config_file_path):
            if get_dir_file(config_file_path):
                config_file_path = config_file_path+get_dir_file(config_file_path)[0]
                deal_file_path["configFile"] = config_file_path
            else:
                return HttpResponse("no files for upload!")
        deal_file_path["report_path"] = os.path.join(baseDir,"InterfaceTest/static/project_tree/{}/report".format(pro_name))
        if caseFile or  configFile:
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
        show_path = report_path[report_path.index("/static"):] #显示单个测试报告路径
        file_down = '/file_download?report_path={}'.format(report_path)
        #show_all_path = report_path[:report_path.index("/report")]  # 显示项目下所有测试报告路径


    else:
        pass

    content = {
        'show_path':show_path,
        'file_down':file_down,
        'report_path':report_path,
        'pro_name':pro_name,
        'caseFile':caseFile,
        'configFile':configFile


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
            pro_dir = os.path.join(baseDir, "InterfaceTest/static/project_tree/{}".format(pro_name))
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



def file_down(request,file_path=None):
    file_path = request.GET.get("report_path")
    p = Path(file_path)
    report_name = p.name
    file=open(file_path,'rb')
    response =HttpResponse(file)
    response['Content-Type']='application/octet-stream'
    response['Content-Disposition']='attachment;filename={}'.format(report_name)
    return response



def get_all_path(request,root_path='',file_list=[],dir_list=[]):
    '''
    查询指定目录下所有文件
    :param request:
    :param root_path: 指定路径
    :return: 所有文件路径列表
    '''

    #获取该目录下所有的文件名称和目录名称
    dir_or_files = os.listdir(root_path)
    query_date = request.GET.get("date")
    report_path = request.GET.get("report_path")

    for dir_file in dir_or_files:
        file_opera = []
        #获取目录或者文件的路径
        dir_file_path = os.path.join(root_path,dir_file)
        #判断该路径为文件还是路径
        if os.path.isdir(dir_file_path):
            dir_list.append(dir_file_path)
        else:
            p = Path(dir_file_path)
            report_name = p.name
            show_path = dir_file_path[dir_file_path.index("/static"):]  # 显示单个测试报告路径
            file_down = '/file_download?report_path={}'.format(dir_file_path)
            file_opera.append(report_name)
            file_opera.append(show_path)
            file_opera.append(file_down)
        file_list.append(file_opera)
    return file_list


def get_dir_file(path,type="files"):
    for root, dirs, files in os.walk(path):
        if type == "root":
            return root  # 当前目录路径
        elif type == "dirs":
            return dirs  # 当前路径下所有子目录
        else:
            return files # 当前路径下所有非目录子文件
