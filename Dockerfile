FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH:/opt/android-sdk/emulator



# Set default shell to bash
SHELL ["/bin/bash", "-c"]

COPY . /opt/transferManagementApp



RUN apt-get update && apt-get install -y \
    curl \
    openjdk-17-jdk \
    wget \
    unzip \
    libgl1 \
    libqt5widgets5 \
    libpulse0 \
    xterm \
    xfce4 \
    openbox \
    tigervnc-standalone-server \
    dbus-x11 \
    x11-xserver-utils \
    sudo \
    supervisor \ 
    nano  \
    bash \
    && apt-get clean

WORKDIR /opt/transferManagementApp
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    if [ -n "$(npm -v)" ]; then npm install; fi

RUN useradd -m -s /bin/bash ubuntu && \
    echo "ubuntu:password" | chpasswd && \
    adduser ubuntu sudo 

RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip /tmp/cmdline-tools.zip -d $ANDROID_HOME/cmdline-tools && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

RUN yes | sdkmanager --licenses

RUN sdkmanager "platform-tools" "emulator" "platforms;android-30" "system-images;android-30;google_apis;x86_64" "buildtools.30.0.3"

#WE LEARNED THAT YOU HAVE TO PASS THE -LOCALNHOST NO FLAG TO ALLOW REMOTE CONNECTIONS
RUN mkdir -p /home/ubuntu/.config && \
    chown -R ubuntu:ubuntu /home/ubuntu && \
    echo '#!/bin/sh' > /etc/X11/Xvnc-session && \
    echo 'exec startxfce4' >> /etc/X11/Xvnc-session && \
    chmod +x /etc/X11/Xvnc-session

RUN echo "allowed_users=anybody" > /etc/X11/Xwrapper.config && \
    echo "needs_root_rights=yes" >> /etc/X11/Xwrapper.config

RUN mkdir -p /etc/supervisord/conf.d
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 5901

#CMD ["/usr/sbin/xrdp", "-nodaemon"]
CMD ["/usr/bin/supervisord", "-n"]