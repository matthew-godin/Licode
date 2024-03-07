if [ "$1" = "i" ] || [ "$1" = "install" ]
    then
        npm i
fi
npm run build
rm -r ../../../Licode-Build/*
cp -r build/* ../../../Licode-Build