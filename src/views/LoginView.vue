<template>
    <div class="login-page d-flex flex-column align-items-center justify-content-center">
      <!-- Logo & Title (Outside Card) -->
      <div class="text-center mb-3">
        <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo" />
      </div>
  
      <!-- Login Form Card -->
      <div class="card p-4 shadow-lg">
        <h2 class="title mt-2">Admin Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="form-control"
              required
            />
          </div>
          <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
          <button type="submit" class="btn btn-primary w-100 mt-3">Login</button>
          <button
            type="button"
            @click="goBack"
            class="btn btn-secondary w-100 mt-2"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: '' // Added error message
      }
    },
    methods: {
      handleLogin() {
        if (this.username === 'SuperAdmin' && this.password === 'superadmin#1') {
          localStorage.setItem('isSuperAdmin', true);
          localStorage.setItem('isAdmin', true); // SuperAdmin is still an Admin, just higher
          this.$router.push('/superadmin'); // Go to SuperAdmin Panel
        } else if (this.username === 'JCAdmin' && this.password === 'jmimgt#1') {
          localStorage.setItem('isAdmin', true);
          this.$router.push('/admin'); // Go to Admin Panel
        } else {
          this.errorMessage = 'Invalid credentials.';
        }
      },

      goBack() {
        this.$router.push('/');
      }
    }
  };
  </script>
  

  <style scoped>
  /* Full-page background */
  .login-page {
    height: 100vh;
    background: linear-gradient(to right, #005aa7, #00c6fb); /* Blue Gradient */
    display: flex;
    flex-direction: column;
  }
  
  /* Logo Styling */
  .logo {
    width: 240px;
    height: auto;
  }
  
  /* Card Styling */
  .card {
    width: 350px;
    border-radius: 10px;
    text-align: center;
    background: rgb(248, 241, 165);
  }
  
  /* H2 Title Color Matching Background */
  .title {
    color: #005aa7; /* Deep Blue */
    font-weight: bold;
  }
  </style>