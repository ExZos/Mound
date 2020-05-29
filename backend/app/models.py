from django.db import models

# Create your models here.

class Space(models.Model):
	name = models.CharField(max_length=50, unique=True)
	status = models.BooleanField(default=False)

	def __str__(self):
		return self.name

	def asDictionary(self):
		return {
			'id': self.id,
			'name': self.name,
			'status': self.status
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

class PollType(models.Model):
	name = models.CharField(max_length=50)

class Poll(models.Model):
	space = models.ForeignKey(Space, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	status = models.NullBooleanField()
	name = models.CharField(max_length=50)
	timestamp = models.DateTimeField(auto_now=True)

class Vote(models.Model):
	poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	result = models.BooleanField()
	timestamp = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('poll', 'user')

	def asDictionary(self):
		return {
			'id': self.id,
			'poll': self.poll.id,
			'user': self.user.id,
			'result': self.result,
			'timestamp': self.timestamp
		}
