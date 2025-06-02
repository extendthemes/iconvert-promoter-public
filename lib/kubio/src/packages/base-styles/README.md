## What is the dist folder?
At build we generate the scss file with the kubio prefix. For kubio is kubio. For kubio children
like cspromo is cspromo. It's determined from the .env file

We need for kubio children to regenerate the style using different blocks names. For example
kubio/button will be cspromo/button. We use the bem framework to generate most of the css
So when kubio is embeded in a kubio child for example in cspromo we want to change the bem prefix

Unfortunately there is no easy way to add javascript variables into scss. So at script build/dev we
will replace the value of the prefix with what value we find in the .env file. 


Kubio does not need the 
