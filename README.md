# Data Entry and Extraction Platform

TODO

## API

TODO

## Deployment

### Requirements

* Python >= 3.4
* Django >= 1.9

### Installation

First setup a virtual environment with Django.

```bash
$ sudo apt-get install python3.4-venv
$ virtualenv ~/deepenv
$ source ~/deepenv/bin/activate
$ pip install django
```

Also install Django REST Framework.

```bash
$ pip install djangorestframework
```

Also install the Readability and PDFMiner modules for stripping text from web and pdf documents.

```bash
$ sudo apt-get install libxml2-dev libxslt-dev
$ pip install readability-lxml
$ pip install requests
$ pip install pdfminer3k
```

Next copy or clone the project to some directory.

### Migration

Migrate all database schema changes:

```bash
$ python manage.py migrate
```

This creates the database if it doesn't exist and introduce all changes since last migration if does.

### Test

Test run the web server:

```bash
$ python manage.py runserver
```

By default, the server should run at `localhost:8000`. Test the website locally by browsing to this address.

### Deploying with uwsgi and nginx

TODO

## Chrome Extension

### Load
1. Go to Settings > Extensions.
2. Check "Developer mode".
3. Hit "Load unpacked extension..." button.
4. Navigate to the Repo directory and select "chrome-extension"

### Usage
Open the extension while browsing the page, fill out the required inputs and submit.
