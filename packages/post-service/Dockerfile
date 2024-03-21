# Use a Maven base image to build the project
FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY ./packages/post-service/pom.xml .
# Download dependencies (improves cache use, as dependencies change less often than source code)
RUN mvn dependency:go-offline
COPY ./packages/post-service/src /app/src
# Build the application without running tests to speed up the process
RUN mvn clean package -DskipTests

# Use OpenJDK image for the final base
FROM openjdk:17-jdk-alpine
WORKDIR /app
# Copy only the built JAR from the builder stage
COPY --from=builder /app/target/post-service-0.0.1.jar /app/post-service.jar
EXPOSE 8080
# Run the Spring Boot application
CMD ["java", "-jar", "post-service.jar"]
