"""
ASGI config for women_youth_empowerment project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import empowerment_app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'women_youth_empowerment.settings')

application = get_asgi_application()




application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            empowerment_app.routing.websocket_urlpatterns
        )
    ),
})
