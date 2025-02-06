# REST API Server Installation

Run the following commands to install JDK 17.

```bash
sudo apt update
sudo apt upgrade
sudo apt install openjdk-17-jdk openjdk-17-jre
```

Run the following commands to install Maven.

```bash
wget https://dlcdn.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip
unzip apache-maven-3.9.9-bin.zip
sudo mv apache-maven-3.9.9 /opt/

```

Add the following line to ~/.profile.

```bash
export PATH=$PATH:/opt/apache-maven-3.9.9/bin
```

Start the REST API server with the following command.

```bash
mvn spring-boot:run
```

In production, use the following command.

```bash
mvn spring-boot:run &
```
