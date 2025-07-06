from django.db import models

class Drawing(models.Model):
    room_name = models.CharField(max_length=100)
    x0 = models.FloatField()
    y0 = models.FloatField()
    x1 = models.FloatField()
    y1 = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.room_name}: ({self.x0}, {self.y0}) → ({self.x1}, {self.y1})"
