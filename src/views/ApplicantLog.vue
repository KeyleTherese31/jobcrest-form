<template>
    <div class="login-page d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div class="text-center mb-4">
        <h2 class="mb-3">Jobseeker Login</h2>
        <p class="lead">Please choose your option:</p>
      </div>
  
      <!-- Login Choices -->
      <div class="card p-4 shadow-lg text-center" style="min-width: 300px;">
        <div class="d-flex flex-column">
          <button @click="goToNewJobseeker" class="btn btn-outline-primary mb-3">
            New Jobseeker
          </button>
          <button @click="goToExistingJobseeker" class="btn btn-outline-success">
            Existing Jobcrest Applicant
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToNewJobseeker() {
        this.$router.push('/jobseeker/cv') // direct to CV form page for new jobseeker
      },
      goToExistingJobseeker() {
        this.$router.push('/loginno') // direct to mobile login page for existing applicants
      }
    }
  }
  </script>
  
  <style scoped>
  .login-page {
    background-color: #f0f4f8;
    padding: 2rem;
  }
  
  .card {
    background: rgb(248, 241, 165);
  }
  </style>
  