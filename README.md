# tgtg-ical

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

A small server that receives mails from TGTG, parses them and generates an iCal feed from them.


## 📦 Installation

	git clone https://github.com/sebbo2002/tgtg-ical.git
    cd ./tgtg-ical

    echo 'DATABASE_URL="mysql://root@localhost:3306/tgtg-ical"' > .env

    npm install
    npx prisma migrate deploy


## 🙋 FAQ

### How does this work?
With the help of tgtg-ical you can generate a personal email address and a corresponding calendar feed. If you store 
this email address at Too Good To Go as an email address for notifications or forward the messages (e.g. via a filter 
rule), collection appointments will be displayed in the corresponding calendar feed.

### Which languages are supported?
Currently only German and English are supported. If you want to add another language, feel free to create a pull request.

### How long are emails stored?
In the best case, the incoming e-mail can be completely analyzed and is then deleted directly. Then only the information 
needed to provide the calendar is stored. If the analysis fails, the email is kept for manual analysis and deleted after 
two weeks at the latest.

### Which databases are supported?
We use [Prisma](https://www.prisma.io/) as ORM. All databases supported by Prisma should therefore work with tgtg-ical.


## 🙆🏼‍♂️ Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
