# Create a Hogwarts Student

## Link to live app: https://hogwarts-client.mbcodes29.vercel.app/

## Demo information:
Username: demoAcct
</br>
Password: demoAcctPass1!

## Notes on futher application progression

Future updates to this application will be student spell points, house points,  dueling and duel stats and the ability to sort students by Hogwarts House.

This app currently allows a user to make selections to create a Hogwarts student, including selecting preferred pronouns, a pet, a wand type, a wand core, a favorite magical Hogwarts school subject, and the ability to randomly sort a student into a Hogwarts House. 

## Landing Page screenshot:
</br>
<a href="https://imgur.com/zwVzPvn"><img src="https://i.imgur.com/zwVzPvn.png" title="source: imgur.com" /></a>

After reading the landing page, the user clicks the 'HERE' button and is redirected to the Create Page, where they will choose input in a form to create their Hogwarts student. 

## Create Page screenshot:
</br>
<a href="https://imgur.com/JotmVt7"><img src="https://i.imgur.com/JotmVt7.png" title="source: imgur.com" /></a>

After creating a student, the student will populate on the My Students Page, along with all other students that are created. The user will also be able to delete students if they choose to. 


## My Students Page screenshot:
<a href="https://imgur.com/WGugjBT"><img src="https://i.imgur.com/WGugjBT.png" title="source: imgur.com" /></a>

## API Documentation


## GET api/students/users/:user_id

This endpoint allows a registered and logged in user to create a new Hogwarts student by clicking on the 'Create' tab or view/delete created students on the 'My Students' page.


## POST api/students/:student_id

This endpoint allows a registered and logged in user to submit input into a form of various Hogwarts student characteristics, and the results will post to the My Students page.

Example response body:

```
{
  pronouns: 'she-her',
  pet: 'Owl',
  wandType: 'birch',
  wandCore: 'unicorn',
  favoriteSubject: 'divination',
  house: 'Gryffindor',
  user_id: 4
}
```

## DELETE api/students/:student_id

This endpoint allows a registered and logged in user to delete a specific student that they've created from the My Students page.


## Technology Used:

Front End: JavaScript, React, HTML5, CSS3

Back End: Node.js, Express, PostgresSQL, Mocha & Chai, REST APIs 3