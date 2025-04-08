<template>
  <div class="welcome-page d-flex flex-column align-items-center justify-content-center min-vh-100">
    <!-- Logo -->
    <div class="text-center mb-4">
      <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo mb-3" />
      <h2 class="mb-3">Welcome to JobCrest</h2>
      <p class="lead">Please select your role:</p>
    </div>

    <!-- Role Selection Card -->
    <div class="card p-4 shadow-lg text-center" style="min-width: 300px;">
      <div class="d-flex flex-column">
        <button @click="goToAdmin" class="btn btn-outline-primary mb-3">
          I am an Admin
        </button>
        <button @click="goToJobseeker" class="btn btn-outline-success">
          I am a Jobseeker
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToAdmin() {
      this.$router.push('/login') // future login page
    },
    goToJobseeker() {
      this.$router.push('/test-selection') // future test navigation
    }
  }
}
</script>

<style scoped>
.welcome-page {
  background-color: #f8f9fa;
  padding: 2rem;
}

.logo {
  max-width: 240px;
  border-radius: 10px;
}
</style>
