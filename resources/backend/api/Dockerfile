FROM public.ecr.aws/amazonlinux/amazonlinux:latest as build

EXPOSE 3000

WORKDIR /app
COPY . /app

RUN yum update -y && \
    curl -fsSL https://rpm.nodesource.com/setup_14.x | bash && \
    yum install -y nodejs && \
    npm install && \
    npm run build

FROM public.ecr.aws/amazonlinux/amazonlinux:latest

WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY package.json /app
COPY package-lock.json /app
RUN yum update -y && \
    curl -fsSL https://rpm.nodesource.com/setup_14.x | bash && \
    yum install -y nodejs && \
    npm install --production

CMD node /app/dist/main.js