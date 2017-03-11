from django.shortcuts import render
from django.template import RequestContext
from django.http import HttpRequest, HttpResponse, JsonResponse
from app.models import Registr
from app.serializers import RegistrSerializer
import json
from rest_framework.response import Response


def home(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html', 
         context_instance = RequestContext(request,
        {})           
    )

def data(request):
    if request.method == 'GET':
        dict = request.GET
        if 'method' in dict:    method  =  dict['method']
        if 'model' in dict:     model   =  dict['model']
        if 'limit' in dict:     limit   =  int(dict['limit'])
        if 'page' in dict:      page    =  int(dict['page'])
        if 'callback' in dict:  callback=  dict['callback']
        err = '"meta":{"success":"false","msg":""}})'
        ok  = '"meta":{"success":"true","msg":""}})'

        if model =='Registr':
            if method=='Read':
                try:
                    count   = Registr.objects.count()
                    serializer = RegistrSerializer(Registr.objects.all()[(page-1)*limit : page*limit], many=True)
                    dict_out= {"data" : serializer.data, "meta": { "success": "true", "msg": "", "total": str(count) }}
                    jsonFormat = json.dumps(dict_out)
                    read_out = dict['callback'] +'(' + jsonFormat + ')'
                    return HttpResponse(read_out)
                except Exception: 
                    error_read=  dict['callback'] +'({"data": "",' + err
                    print('Ошибка при чтении данных ...')
                    return HttpResponse(error_read)

            if method=='Create':
                try:
                    create_obj  = RegistrSerializer(Registr.objects.create(
                        fam     = dict['fam'],
                        im      = dict['im'],
                        otch    = dict['otch'],
                        city    = dict['city'],
                        street  = dict['street']))
                    create_out = dict['callback'] +'({"data":{"id":' + str(create_obj.id) + '},' + ok

                    return HttpResponse(create_out);
                except Exception:
                    error_create = dict['callback'] +'({"data":{"id":' + dict['id'] +'},' + err 
                    print('Ошибка при добавлении данных ...')
                    return HttpResponse(error_create)

            if method=='Update':
                try:

                    update_obj = Registr.objects.get(id = dict['id'])
                    update_obj.fam    = dict['fam']
                    update_obj.im     = dict['im']
                    update_obj.otch   = dict['otch']
                    update_obj.city   = dict['city']
                    update_obj.street = dict['street']
                    update_obj.save()
                    update_out = dict['callback'] +'({"data":{"id":' + str(update_obj.id) + '},' + ok
                    return HttpResponse(update_out)
                except Exception: 
                    error_update = dict['callback'] +'({"data":{"id":' + dict['id'] +'},' + err        
                    print('Ошибка при обновлении данных ...')
                    return HttpResponse(error_update)
            if method=='Destroy':
                try:
                    delete_obj = Registr.objects.get(id = dict['id'])
                    delete_obj.delete()
                    delete_out = dict['callback'] +'({"data":null,'   + ok
                    return HttpResponse(delete_out)
                except Exception:
                    print('Ошибка при удалении данных ...')
                    error_delete = dict['callback'] +'({"data":null,' + err
                    return HttpResponse(error_delete)
