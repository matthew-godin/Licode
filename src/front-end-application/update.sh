if [ "$1" = "i" ] || [ "$1" = "install" ]
    then
        npm i
fi
npm run build
rm -r /var/www/html/licode/*
cp -r build/* /var/www/html/licode