import jinja2
import webapp2
import os
from google.appengine.api import users

JINJA_ENV = jinja2.Environment(
    loader = jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions = ['jinja2.ext.autoescape'],
    autoescape = True
)

class LoginHandler(webapp2.RequestHandler):
    def get(self):
        #defines content as the HTML template main.html using the JINJA_ENV defined above
        content = JINJA_ENV.get_template('templates/login.html')            
        self.response.write(content.render(params))

app = webapp2.WSGIApplication([
    ('/', LoginHandler),
    ('/main', MainHandler),
#    ('/leaderboard', LeaderboardHandler)
], debug=True)
