
pipeline {
    agent any

    stages {
        stage('Checkout Verification') {
            steps {
                echo 'Notifier source code checked out by Jenkins'
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose config -q'
                echo 'Docker Compose configuration is valid'
            }
        }
    }

    post {
        success {
            echo 'Notifier pipeline validation succeeded!'
        }
        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }
    }
}
