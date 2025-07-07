from celery import shared_task
from .models import Drawing

@shared_task
def save_drawing_task(room_name, x0, y0, x1, y1):
    Drawing.objects.create(
        room_name=room_name,
        x0=x0,
        y0=y0,
        x1=x1,
        y1=y1,
    )
