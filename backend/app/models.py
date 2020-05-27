from django.db import models

# Create your models here.

class Space(models.Model):
	name = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return self.name

	def asDictionary(self):
		return {
			'id': self.id,
			'name': self.name
		}

class User(models.Model):
	space = models.ForeignKey(Space, on_delete=models.CASCADE)
	name = models.CharField(max_length=50)
	lastActive = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('space', 'name')

	def __str__(self):
		return self.name

	def asDictionary(self):
		return {
			'id': self.id,
			'space': self.space.id,
			'name': self.name,
			'lastActive': self.lastActive
		}

class Message(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	content = models.TextField()
	timestamp = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.content

class CreatePoll(models.Model):
	name = models.CharField(max_length=50, unique=True)
	status = models.NullBooleanField()
	timestamp = models.DateTimeField(auto_now=True)

class CreateVote(models.Model):
	createPoll = models.ForeignKey(CreatePoll, on_delete=models.CASCADE)
	name = models.CharField(max_length=50)
	result = models.BooleanField()
	timestamp = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('createPoll', 'name')

	def asDictionary(self):
		return {
			'id': self.id,
			'createPoll': self.createPoll.id,
			'name': self.name,
			'result': self.result,
			'timestamp': self.timestamp
		}
