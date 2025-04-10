<template>
 <div class="jobseeker-cv-page">
  <div class="jobseeker-cv-form container py-4">
    <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo" />
    <h2 class="text-center mb-4">Curricilum Vitae Form</h2>
    <form @submit.prevent="submitForm">
      <!-- Position and Admin Only Section -->
      <div class="form-group">
        <label>Position Applied for:</label>
        <input type="text" v-model="form.position" class="form-control" required />
      </div>
      <div class="form-group">
        <label>Date Applied:</label>
        <input type="date" v-model="form.date_applied" class="form-control" readonly />
      </div>

      <!-- I. PERSONAL IDENTITY -->
      <fieldset class="mt-4">
        <legend>I. PERSONAL IDENTITY</legend>
        <div class="form-row">
          <div class="col"><input class="form-control" v-model="form.last_name" placeholder="Last Name" required /></div>
          <div class="col"><input class="form-control" v-model="form.first_name" placeholder="First Name" required /></div>
          <div class="col"><input class="form-control" v-model="form.middle_name" placeholder="Middle Name" /></div>
        </div>

        <input class="form-control mt-2" v-model="form.address" placeholder="Full Address" />
        <input class="form-control mt-2" v-model="form.contact_no" placeholder="Contact No." />
        <label class="mt-2">Date of Birth:</label>
        <input type="date" v-model="form.dob" class="form-control" />
        <input class="form-control mt-2" v-model="form.pob" placeholder="Place of Birth" />
        <input class="form-control mt-2" v-model="form.email" type="email" placeholder="Email Address" />
        <input class="form-control mt-2" v-model="form.national_id" placeholder="National ID No." />
        <input class="form-control mt-2" v-model="form.sss_no" placeholder="SSS No." />

        <div class="form-group mt-2">
          <label>TIN No.:</label>
          <input class="form-control" v-model="form.tin_no" :disabled="form.tin_new" />
          <div class="form-check">
            <input type="checkbox" v-model="form.tin_new" class="form-check-input" id="tinNew" />
            <label for="tinNew" class="form-check-label">NEW</label>
          </div>
        </div>

        <input class="form-control mt-2" v-model="form.pagibig" placeholder="Pag-Ibig (HDMF) No." />
        <input class="form-control mt-2" v-model="form.philhealth" placeholder="Philhealth No." />
        <input class="form-control mt-2" v-model="form.civil_status" placeholder="Civil Status and No. of Dependents" />
      </fieldset>

      <!-- II. EDUCATIONAL BACKGROUND -->
      <fieldset class="mt-4">
        <legend>II. EDUCATIONAL BACKGROUND</legend>
        <div v-for="(level, i) in educationLevels" :key="i" class="form-group">
          <label>{{ level.label }}</label>
          <input class="form-control mt-1" v-model="form.education[level.key]" placeholder="Degree/Course, School/Location, Year Attended" />
        </div>
      </fieldset>

      <!-- III. SCHOLARSHIPS / LICENSES -->
      <fieldset class="mt-4">
        <legend>III. SCHOLARSHIPS / LICENSES</legend>
        <input class="form-control mb-2" v-model="form.scholarships[0]" placeholder="Scholarship/Award/License, Institution" />
        <input class="form-control" v-model="form.scholarships[1]" placeholder="Scholarship/Award/License, Institution" />
      </fieldset>

      <!-- IV. FAMILY BACKGROUND -->
      <fieldset class="mt-4">
        <legend>IV. FAMILY BACKGROUND</legend>
        <div class="form-group">
          <label>Spouse (Maiden Name)</label>
          <input class="form-control" v-model="form.spouse" placeholder="Last Name, First Name, Age, Occupation" />
        </div>
        <div class="form-group">
          <label>Mother (Maiden Name)</label>
          <input class="form-control" v-model="form.mother" placeholder="Last Name, First Name, Age, Occupation" />
        </div>
        <div class="form-group">
          <label>Father</label>
          <input class="form-control" v-model="form.father" placeholder="Last Name, First Name, Age, Occupation" />
        </div>
      </fieldset>

      <!-- V. EMPLOYMENT HISTORY -->
      <fieldset class="mt-4">
        <legend>V. EMPLOYMENT HISTORY</legend>
        <input class="form-control mb-2" v-model="form.employment[0]" placeholder="Employer, Address, Position, Tenure" />
        <input class="form-control" v-model="form.employment[1]" placeholder="Employer, Address, Position, Tenure" />
      </fieldset>

      <!-- VI. REFERENCES -->
      <fieldset class="mt-4">
        <legend>VI. REFERENCES</legend>
        <input class="form-control mb-2" v-model="form.references[0]" placeholder="Name, Occupation, Contact No., Yrs. Known" />
        <input class="form-control" v-model="form.references[1]" placeholder="Name, Occupation, Contact No., Yrs. Known" />
      </fieldset>

      <!-- VII. DECLARATION -->
      <fieldset class="mt-4">
        <legend>VII. DECLARATION</legend>
        <p>
          I hereby acknowledge that the above information are true and correct to the best of my knowledge and ability,
          and any false statements made by me on this application or any supplement record thereto attached shall be
          sufficient ground/s for disqualification from the company.
        </p>
        <div class="form-group">
          <label>Upload Signature:</label>
          <input type="file" @change="handleSignatureUpload" class="form-control" />
        </div>
      </fieldset>

      <button class="btn btn-primary mt-3" type="submit">Submit</button>
    </form>
  </div>
 </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        position: '',
        date_applied: new Date().toISOString().substr(0, 10),
        last_name: '',
        first_name: '',
        middle_name: '',
        address: '',
        contact_no: '',
        dob: '',
        pob: '',
        email: '',
        national_id: '',
        sss_no: '',
        tin_no: '',
        tin_new: false,
        pagibig: '',
        philhealth: '',
        civil_status: '',
        education: {
          college: '',
          vocational: '',
          highschool: '',
          graduate: '',
          skills: '',
          computer: '',
          machine: ''
        },
        scholarships: ['', ''],
        spouse: '',
        mother: '',
        father: '',
        employment: ['', ''],
        references: ['', ''],
        signature: null
      },
      educationLevels: [
        { label: 'College', key: 'college' },
        { label: 'Vocational', key: 'vocational' },
        { label: 'High School', key: 'highschool' },
        { label: 'Graduate Studies', key: 'graduate' },
        { label: 'Special Course/Skills', key: 'skills' },
        { label: 'Computer Literacy', key: 'computer' },
        { label: 'Machina/Stn Handled', key: 'machine' },
      ]
    };
  },
  methods: {
    submitForm() {
      // Save to Supabase and navigate to TestPage
      this.$router.push('/test-selection');
    },
    handleSignatureUpload(event) {
      const file = event.target.files[0];
      this.form.signature = file;
    }
  }
};
</script>

<style scoped>
.jobseeker-cv-page {
  background: #034c8b;
}
.jobseeker-cv-form {
  max-width: 800px;
  margin: 0 auto;
  background: #c0def8;
}
</style>
