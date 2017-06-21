# Feature-Dependent-Migration-Calculator
An application for calculating the dependency of migration based on certian limiting features.

Read Me:

This app will allow you to observe how certain features allow you to migrate from one state to another.

The app expects a CSV file. The first row should be composed of table headers, and then you can have any number of columns with data.

Columns where you want to track data should only have the values "True" or "False". All other columns are ignored. This is calibrated based on the first row of data in the CSV.
Example

Let's say you have a bunch of different birds all in different cages for their specific needs.

Your goal is to create a super-cage which can hold them all.

To do this, you must track all the different needs of these birds, and what features your cage currently has. As you add a feature to the cage, some subset of birds should be able to move into the cage.

Looking at the data from this perspective may help you decide which features are most important and will affect the most birds.
Notes

Note that there are two ways to observe data using this page:

    Starting with everything selected, and then removing features to see the density of the population dependent on those features. (default)
    Starting with nothing selected, and then adding features to see the number you would be able to migrate if you implemented those features.

With the example data, starting with everything selected, and removing water, you will see that a huge density of the birds would be unable to migrate. So clearly this is an important feature.

However, if you start with no features selected, and then just select water, you will see again that almost no birds can migrate, because many of them have additional dependencies.

You will need to use both perspectives to make decisions about the most important features required for migration. Play around and see!
