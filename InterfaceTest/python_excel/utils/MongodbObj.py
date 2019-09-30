from pymongo import MongoClient

class MongodbObj:
    def __init__(self,**kwargs):
        self.kwargs = kwargs
        mongodb_url = self.kwargs.get("mongodb_url","")
        # 连接mongdb数据库
        uri = "mongodb://root:Tsa123456@s-2ze0d176aa33db14.mongodb.rds.aliyuncs.com:3717"
        uri = "mongodb://root:Tsa123456@s-2ze675fadff2cc84.mongodb.rds.aliyuncs.com:3717"
        #uri = "mongodb://root:Tsa123456@s-2ze2307ab7c83c24-pub.mongodb.rds.aliyuncs.com:3717"  #测试环境数据库地址
        database = self.kwargs.get("db_obj", "")
        client = MongoClient(uri)
        print(client.database_names()) #查看所有数据库  ['tsa_ra_cert2', 'tsa_ra_certinfo', 'tsa_ra_certinfo2', 'tsa_ra_certinfo_test', 'tsa_token', 'admin', 'config']
        #self.db = client.admin      #admin为数据库名称，第一种连接数据库方法
        self.db = client["tsa_ra_certinfo"]   #admin为数据库名称，第二种连接数据库方法
        print(self.db.collection_names()) #查看数据库下所有集合名称 ['certinfo_2018', 'certinfo_2019', 'sequence', 'system.profile']
        tsa_token = self.db.certinfo_2019  #连接集合
        #print(tsa_token.name)  #显示当前集合名称
        s = tsa_token.find({"password":"111222"})
        print(list(s))
        # 获取数据库db对象 库的名称 py3
        #db = db_obj #eg:db = client.py3

    def operation_table(self):
        # 获取集合对象 表的名称 collection ==> mdata
        #collection = db.mdata
        pass

if __name__ == "__main__":
    mo = MongodbObj()



