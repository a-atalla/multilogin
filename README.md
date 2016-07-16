# multilogin
My solution for the testing scenarios from [Sleighdogs](http://www.sld.gs) test for new developers
# The Problem
Multiple logins
We require the developer to implement a sign­up/sign­in/password­reset workflows solution for 
an application. However, this is not ordinary user workflows. We have some special 
requirements for the the user accounts connected to different roles the account can have. 

#### Sign­in 
- basic login account (user) info to store: email address, gender, first name, surname 
- there are 3 login types (roles): orchestra officer, member and musician 
- all logins are based on email addresses 
- one email address can be used only once per login type; that also means that there can 
  be for example orchestra officer with same email address as one of the 
  musicians/members, but never more than one login type with one email address 
- accounts with same email address will always share the same password, changing 
  password for a user will affect other users with same email address 
- user can log in for only one of the roles at the time; switching to different role means 
  logging out and logging in with different role 
- if more than one role is detected for given log­in, user will be prompted with selection 
  which role he/she wants to take upon logging in

#### Sign­up 
- only orchestras and musicians have public sign­up forms 
- orchestra sign­up form requires user to fill in email address, officers gender, first name 
  and surname, and orchestra name 
- musician sign­up form has email address, gender, first name and surname fields 
- members are added by orchestras manually, there is no public sign­up form for 
  members 
- sign­up process works with double option: 
  - user fills in and submits sign­up form to register new account 
  - system sends email with confirmation link to users emails address 
  - user follows confirmation link to activate newly registered account 
  - after this step, user is able to login

#### Forgotten password 
- all users have an ability to reset their password, including members 
- resetting password is done in following steps: 
  - user fills email address in forgotten password form 
  - if system finds user tied to this email address, it will generates random reset 
    token and sends reset link (URL) to given email address 
  - after visiting generated reset URL, user can type in the new password twice for 
    confirmation and submit the form to update to the new password 
