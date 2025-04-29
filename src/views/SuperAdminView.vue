<template>
    <div class="container mt-4 admin-panel-wrapper">
      <!-- Back Button -->
      <button class="btn btn-back mb-3" @click="$router.back()">
        <img src="@/assets/back-button.png" alt="back"> Back
      </button>
  
      <!-- Logo and Heading -->
      <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo mx-auto d-block mb-3" />
      <h2 class="text-center text-primary mb-4">SuperAdmin Panel</h2>
  
      <!-- Action Buttons -->
      <div class="action-buttons mb-4">
        <button @click="toggleSection('questions')" class="btn btn-lg btn-blue-yellow">
          Manage Test Questions
        </button>
        <button @click="toggleSection('results')" class="btn btn-lg btn-yellow-blue">
          View Jobseeker Test Results
        </button>
        <button @click="toggleSection('cvs')" class="btn btn-lg btn-blue">
          View Submitted CVs
        </button>
        <button @click="toggleSection('admins')" class="btn btn-lg btn-green">
          Manage Admins
        </button>
      </div>
  
      <!-- Manage Questions Section -->
      <div v-if="activeSection === 'questions'" class="section-box">
        <h3 class="text-blue">Manage Questions</h3>
        <button @click="goToCreateQuestion" class="btn btn-outline-primary mb-3">
          Create New Question
        </button>
        <button @click="goToEditQuestions" class="btn btn-outline-secondary mb-3">
          Edit/Delete Questions
        </button>
      </div>
  
      <!-- View Results Section -->
      <div v-if="activeSection === 'results'" class="section-box">
        <h3 class="text-blue">Jobseeker Results</h3>
        <button @click="downloadResults" class="btn btn-outline-success mb-3">
          Download Test Results (CSV)
        </button>
        <div v-if="jobseekerResults.length > 0">
          <ul class="list-group">
            <li
              v-for="(result, index) in jobseekerResults"
              :key="index"
              class="list-group-item result-item"
            >
              <strong>Test ID: {{ result.timestamp }}</strong>
              <ul class="mb-0">
                <li v-for="(answer, idx) in result.answers" :key="idx">
                  Question {{ idx + 1 }}: {{ answer }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-else>
          <p class="text-muted">No results submitted yet.</p>
        </div>
      </div>
  
      <!-- View CV Profiles -->
      <div v-if="activeSection === 'cvs'" class="section-box">
        <h3 class="text-blue mb-4">Submitted CVs</h3>
  
        <div v-if="cvList.length" class="cv-list">
          <div
            v-for="cv in cvList"
            :key="cv.id"
            class="cv-card d-flex justify-content-between align-items-center p-3 mb-3 border rounded shadow-sm"
          >
            <div>
              <h5 class="mb-1">{{ cv.last_name }}, {{ cv.first_name }}</h5>
              <p class="mb-0 text-muted">Applied for: <strong>{{ cv.position_applied }}</strong></p>
              <small class="text-secondary">Date Applied: {{ cv.date_applied }}</small>
            </div>
  
            <div class="button-group text-end">
              <button class="btn btn-sm btn-outline-primary me-2" @click="viewCV(cv)">
                <i class="fas fa-eye"></i> View
              </button>
              <button class="btn btn-sm btn-outline-success" @click="downloadCV(cv)">
                <i class="fas fa-download"></i> Download
              </button>
            </div>
          </div>
  
          <!-- CV Viewer (Print Preview) -->
          <transition name="fade">
            <div v-if="selectedCV" class="cv-preview mt-4 p-3 border bg-light rounded">
              <h5 class="text-center text-primary">CV Preview - {{ selectedCV.last_name }}, {{ selectedCV.first_name }}</h5>
              <CVPrint
                :form="selectedCV"
                :educationLevels="educationLevels"
                :familyMembers="familyMembers"
                ref="cvRef"
              />
            </div>
          </transition>
        </div>
  
        <div v-else>
          <p class="text-muted">No CVs submitted yet.</p>
        </div>
      </div>
  
      <!-- Manage Admins Section -->
      <div v-if="activeSection === 'admins'" class="section-box">
        <h3 class="text-blue">Manage Admins</h3>
        <button @click="goToCreateAdmin" class="btn btn-outline-primary mb-3">
          Create New Admin
        </button>
        <button @click="goToEditAdmins" class="btn btn-outline-secondary mb-3">
          Edit/Delete Admins
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import CVPrint from '@/components/CVPrint.vue'
  import { createClient } from '@supabase/supabase-js'
  
  const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
  const supabaseKey = process.env.VUE_APP_SUPABASE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  export default {
    components: {
      CVPrint
    },
    data() {
      return {
        activeSection: '',
        jobseekerResults: [],
        cvList: [],
        selectedCV: null,
        educationLevels: [
          { label: 'College', key: 'college' },
          { label: 'Vocational', key: 'vocational' },
          { label: 'High School', key: 'highschool' },
          { label: 'Graduate Studies', key: 'graduate' },
          { label: 'Special Course/Skills', key: 'skills' },
          { label: 'Computer Literacy', key: 'computer' },
          { label: 'Machina/Stn Handled', key: 'machine' }
        ],
        familyMembers: {
          spouse: { label: 'Spouse (Maiden Name)' },
          mother: { label: 'Mother (Maiden Name)' },
          father: { label: 'Father' }
        }
      }
    },
    mounted() {
      const results = localStorage.getItem('responses')
      if (results) {
        this.jobseekerResults = JSON.parse(results)
      }
    },
    methods: {
      toggleSection(section) {
        this.activeSection = this.activeSection === section ? '' : section
        if (section === 'cvs' && this.activeSection === 'cvs') {
          this.fetchCVs()
          this.selectedCV = null
          this.$nextTick(() => {
            const el = document.querySelector('.section-box')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          })
        }
      },
      goToCreateQuestion() {
        this.$router.push('/admin/create-question')
      },
      goToEditQuestions() {
        this.$router.push('/admin/edit-questions')
      },
      downloadResults() {
        const results = JSON.parse(localStorage.getItem('responses') || '[]')
        let csv = 'Test ID, Answers\n'
        results.forEach(result => {
          csv += `${result.timestamp}, ${result.answers.join('; ')}\n`
        })
        const blob = new Blob([csv], { type: 'text/csv' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'jobseeker_results.csv'
        link.click()
      },
      async fetchCVs() {
        const { data, error } = await supabase.from('jobseeker_profiles').select('*')
        if (!error) {
          this.cvList = data
        } else {
          console.error('CV fetch error:', error)
        }
      },
      viewCV(cv) {
        this.selectedCV = this.selectedCV?.id === cv.id ? null : cv
      },
      downloadCV(cv) {
        this.selectedCV = cv
        this.$nextTick(() => {
          this.$refs.cvRef.downloadPDF()
        })
      },
      goToCreateAdmin() {
        // Route to create a new admin page
        this.$router.push('/superadmin/create-admin')
      },
      goToEditAdmins() {
        // Route to edit or delete admins
        this.$router.push('/superadmin/edit-admins')
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-panel-wrapper {
    background-color: #f2f9ff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 0 12px rgba(0, 85, 170, 0.08);
  }
  
  .logo {
    max-width: 220px;
    border-radius: 10px;
  }
  
  .btn-back {
    background-color: #ffcc00;
    color: #003366;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    padding: 6px 14px;
  }
  
  .btn-back:hover {
    background-color: #ffe066;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .btn-blue-yellow {
    background-color: #007bff;
    color: white;
    font-weight: 500;
    border-radius: 10px;
    width: 100%;
  }
  
  .btn-yellow-blue {
    background-color: #ffcc00;
    color: #003366;
    font-weight: 500;
    border-radius: 10px;
    width: 100%;
  }
  
  .btn-blue {
    background-color: #ffffff;
    color: #003366;
    font-weight: 500;
    border-radius: 10px;
    border-color: #003366;
    width: 100%;
  }
  
  .btn-green {
    background-color: #28a745;
    color: white;
    font-weight: 500;
    border-radius: 10px;
    width: 100%;
  }
  
  .section-box {
    background-color: white;
    border-left: 6px solid #007bff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 0 8px rgba(0, 85, 170, 0.05);
    margin-bottom: 20px;
  }
  
  .result-item {
    border-left: 4px solid #28a745;
  }
  
  .text-blue {
    color: #0056b3;
  }
  
  .cv-list .cv-card {
    transition: box-shadow 0.2s;
  }
  .cv-list .cv-card:hover {
    box-shadow: 0 2px 10px rgba(0, 123, 255, 0.1);
  }
  
  .button-group button {
    min-width: 100px;
  }
  
  .cv-preview {
    max-height: 600px;
    overflow-y: auto;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  