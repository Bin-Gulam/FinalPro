from django.apps import AppConfig

class EmpowermentAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'empowerment_app'

    def ready(self):
        pass



