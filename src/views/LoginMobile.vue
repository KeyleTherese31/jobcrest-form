<template>
    <div class="login-mobile-page d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div class="text-center mb-4">
        <h2 class="mb-3">Existing Jobcrest Applicant</h2>
        <p class="lead">Please enter your mobile number:</p>
      </div>
  
      <!-- Mobile Login Form -->
      <div class="card p-4 shadow-lg text-center" style="min-width: 300px;">
        <div class="d-flex flex-column">
          <input 
            v-model="mobileNumber" 
            type="text" 
            class="form-control mb-3" 
            placeholder="Enter Mobile Number"
          />
          <button @click="checkMobileNumber" class="btn btn-outline-success">
            Login
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { createClient } from '@supabase/supabase-js'
  
  const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
  const supabaseKey = process.env.VUE_APP_SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  export default {
    data() {
      return {
        mobileNumber: '',
      }
    },
    mmethods: {
      async checkMobileNumber() {
        const mobile = this.mobileNumber.trim()

        if (!mobile) {
          alert('Please enter your mobile number.')
          return
        }

        const { data, error } = await supabase
          .from('jobseeker_profiles')
          .select('*')
          .eq('contact_no', mobile)

        if (error) {
          console.error('Error checking mobile number:', error)
          alert('Something went wrong. Please try again.')
        } else if (data.length > 0) {
          this.$router.push('/test-selection')
        } else {
          alert('No jobseeker found with this mobile number.')
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-mobile-page {
    background-color: #f9f9f9;
    padding: 2rem;
  }
  
  .card {
    background: rgb(248, 241, 165);
  }
  </style>
  