from django.db import models


class Registr(models.Model):
    fam     =   models.CharField(max_length = 255, null=True)
    im      =   models.CharField(max_length = 255, null=True)
    otch    =   models.CharField(max_length = 255, null=True)
    city    =   models.CharField(max_length = 50,  null=True)  
    street  =   models.CharField(max_length = 255, null=True)
    def __unicode__(self):
        return self.fam