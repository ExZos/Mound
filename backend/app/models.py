from django.db import models

# Create your models here.

class Space(models.Model):
	name = models.CharField(max_length=50, unique=True)

class User(models.Model):
	space = models.ForeignKey(Space, on_delete=models.CASCADE)
	name = models.CharField(max_length=50)

	class Meta:
		unique_together = ('space', 'name')

class Message(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	content = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)
