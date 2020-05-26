from django.db import models

# Create your models here.

class Space(models.Model):
	name = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return self.name

class User(models.Model):
	space = models.ForeignKey(Space, on_delete=models.CASCADE)
	name = models.CharField(max_length=50)
	lastActive = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('space', 'name')

	def __str__(self):
		return self.name

class Message(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	content = models.TextField()
	timestamp = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.content

class SpaceRequestType(models.Model):
	name = models.CharField(max_length=15, unique=True)

	def __str__(self):
		return self.name

class SpaceRequest(models.Model):
	space = models.ForeignKey(Space, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	type = models.ForeignKey(SpaceRequestType, on_delete=models.CASCADE)
	status = models.NullBooleanField()
	timestamp = models.DateTimeField(auto_now=True)

class SpaceResponse(models.Model):
	spaceRequest = models.ForeignKey(SpaceRequest, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	result = models.BooleanField()
	timestamp = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('spaceRequest', 'user')
