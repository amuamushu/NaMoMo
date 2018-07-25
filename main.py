import json
import webapp2
import jinja2
import os
import datetime
import logging

from google.appengine.api import users
from google.appengine.ext import ndb

#defines the Jinja2 environment
JINJA_ENV = jinja2.Environment(
    loader = jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions = ['jinja2.ext.autoescape'],
    autoescape = True
)

#defines what properties a user will have once they sign in
class CssiUser(ndb.Model):
  first_name = ndb.StringProperty()
  last_name = ndb.StringProperty()

#defines what properties a monthly usage entry will have
class Entry(ndb.Model):
    date = ndb.DateProperty()
    heating_usage = ndb.IntegerProperty()
    cooling_usage = ndb.IntegerProperty()
    lighting_usage = ndb.IntegerProperty()
    appliance_usage = ndb.IntegerProperty()
    user_id = ndb.StringProperty()


class LoginHandler(webapp2.RequestHandler):
  def get(self):
    user = users.get_current_user()
    # If the user is logged in...
    if user:
      email_address = user.nickname()
      cssi_user = CssiUser.get_by_id(user.user_id())
      signout_link_html = '<a href="%s">sign out</a>' % (
          users.create_logout_url('/logout'))
      # If the user has previously been to our site, we greet them!
      if cssi_user:
        self.response.write('''
            Welcome %s %s (%s)! <br> %s <br>''' % (
                cssi_user.first_name,
                cssi_user.last_name,
                email_address,
                signout_link_html))
        self.redirect("/main")
      # If the user hasn't been to our site, we ask them to sign up
      else:
        self.response.write('''
            Welcome to our site, %s!  Please sign up! <br>
            <form method="post" action="/">
            <label>First name: &nbsp</label>
            <input type="text" name="first_name">
            <label>Last name: &nbsp</label>
            <input type="text" name="last_name">
            <input type="submit">
            </form><br> %s <br>
            ''' % (email_address, signout_link_html))
    # Otherwise, the user isn't logged in!
    else:
      self.response.write('''
      <head><link rel = "stylesheet" type = "text/css" href = "css/login.css"></head>
      <div class="login-page">
      <div class="form">
      <h2>Please log in or sign up using a Gmail account to use NaMoMo</h2>
      <a href="%s"><button>login</button></a>

        </div>
        </div>''' % (
          users.create_login_url('/')))



  def post(self):
    user = users.get_current_user()
    if not user:
      # You shouldn't be able to get here without being logged in
      self.error(500)
      return
    cssi_user = CssiUser(
        first_name=self.request.get('first_name'),
        last_name=self.request.get('last_name'),
        id=user.user_id())
    cssi_user.put()
    self.response.write('Thanks for signing up, %s!' %
        cssi_user.first_name)


class LogoutHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            signout_link_html = users.create_logout_url('/')
            email_address = user.nickname()
            cssi_user = CssiUser.get_by_id(user.user_id())
            self.redirect(signout_link_html)


#gets all user entries and runs main page
class MainHandler(webapp2.RequestHandler):
    def get(self):
        content = JINJA_ENV.get_template('templates/main.html')
        entries = Entry.query().filter(Entry.user_id == users.get_current_user().user_id()).fetch()
        self.response.write(content.render())

#runs input page and saves data from the user to the datastore
class InputHandler(webapp2.RequestHandler):
    def get(self):
        content = JINJA_ENV.get_template('templates/input.html')
        self.response.write(content.render())

    def post(self):
        button = False
        entry = Entry(
        heating_usage = int(self.request.get('heating_usage')),
        cooling_usage = int(self.request.get('cooling_usage')),
        lighting_usage = int(self.request.get('lighting_usage')),
        appliance_usage = int(self.request.get('appliance_usage')),
        date = datetime.datetime.strptime("07/24/2018", "%m/%d/%Y").date(),
        user_id = users.get_current_user().user_id()
        )
        entry.put()
        content = JINJA_ENV.get_template('templates/input.html')
        self.response.write(content.render(button = True))

#sends JSON to the server to put in the JS
class JSONHandler(webapp2.RequestHandler):
    def get(self):
        entries = Entry.query().filter(Entry.user_id == users.get_current_user().user_id()).fetch()
        chart_data = {}
        bar = [['Month', 'Heating', 'Cooling', 'Lights',
    'Appliance', { "role": 'annotation' } ]]
        month_dictionary = {
        "1": "January",
         "2": "February",
         "3": "March",
         "4": "April",
         "5": "May",
         "6": "June",
         "7": "July",
         "8": "August",
         "9": "September",
         "10": "October",
         "11": "November",
         "12": "December"
         }
        for entry in entries:
            monthly_results = [month_dictionary[str(entry.date.month)], entry.heating_usage, entry.cooling_usage, entry.lighting_usage,
            entry.appliance_usage, '']
            bar.append(monthly_results)
        chart_data["bar"] = bar

        month = "July"
        pie = [['Energy Usage', 'Amount']]
        for entry in entries:
            if month_dictionary[str(entry.date.month)] == month:
                pie.append(['Heating', entry.heating_usage])
                pie.append(['Cooling', entry.cooling_usage])
                pie.append(['Lighting', entry.lighting_usage])
                pie.append(['Appliance', entry.appliance_usage])
        chart_data["pie"] = pie

        data_type = "heating_usage"
        line = [['Month', 'Energy Usage (KW)']]
        for entry in entries:
            if data_type == "heating_usage":
                line.append([month_dictionary[str(entry.date.month)], entry.heating_usage ])
                type = "heati"
            elif data_type == "cooling_usage":
                line.append([month_dictionary[str(entry.date.month)], entry.cooling_usage ])
            elif data_type == "lighting_usage":
                line.append([month_dictionary[str(entry.date.month)], entry.lighting_usage ])
            elif data_type == "appliance_usage":
                line.append([month_dictionary[str(entry.date.month)], entry.appliance_usage])

        chart_data["line"] = line
        self.response.out.write(json.dumps(chart_data))

#operates the leaderboard page, handing in savings as a parameter
class LeaderboardHandler(webapp2.RequestHandler):
    def get(self):
        content = JINJA_ENV.get_template('templates/leaderboard.html')
        self.response.write(content.render())


app = webapp2.WSGIApplication([
  ('/', LoginHandler),
  ('/main', MainHandler),
  ('/input', InputHandler),
  ('/leaderboard', LeaderboardHandler),
  ('/logout', LogoutHandler),
  ('/JSON', JSONHandler)
], debug=True)
