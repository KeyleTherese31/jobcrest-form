<template>
  <div class="container mt-4">
    <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo mb-3" />
    <h2 class="mb-4">Curriculum Vitae Form</h2>
    <br>
    <form @submit.prevent="submitCV">
      <!-- I. PERSONAL IDENTITY -->
      <div v-if="currentSection === 1">
        <h4>I. Personal Identity</h4>
        <!-- Personal Identity Fields -->
        <div class="form-row">
          <div class="form-group col-md-4">
            <label>Last Name</label>
            <input v-model="cv.lastName" class="form-control" required />
          </div>
          <div class="form-group col-md-4">
            <label>First Name</label>
            <input v-model="cv.firstName" class="form-control" required />
          </div>
          <div class="form-group col-md-4">
            <label>Middle Name</label>
            <input v-model="cv.middleName" class="form-control" />
          </div>
        </div>
        <div class="form-group">
          <label>Address</label>
          <textarea v-model="cv.address" class="form-control" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Contact No.</label>
            <input v-model="cv.contact" class="form-control" />
          </div>
          <div class="form-group col-md-6">
            <label>Date of Birth</label>
            <input type="date" v-model="cv.dob" class="form-control" />
          </div>
        </div>
        <div class="form-group">
          <label>Place of Birth</label>
          <input v-model="cv.pob" class="form-control" />
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="cv.email" class="form-control" />
        </div>

        <div class="form-row">
          <div class="form-group col-md-4">
            <label>National ID No.</label>
            <input v-model="cv.nationalId" class="form-control" />
          </div>
          <div class="form-group col-md-4">
            <label>SSS No.</label>
            <input v-model="cv.sssNo" class="form-control" required />
          </div>
          <div class="form-group col-md-4">
            <label>TIN No.</label>
            <input :disabled="cv.isNewTIN" v-model="cv.tinNo" class="form-control" />
            <div class="form-check mt-1">
              <input type="checkbox" v-model="cv.isNewTIN" class="form-check-input" id="newTIN" />
              <label class="form-check-label" for="newTIN">NEW</label>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Pag-Ibig No.</label>
            <input v-model="cv.pagibigNo" class="form-control" />
          </div>
          <div class="form-group col-md-6">
            <label>PhilHealth No.</label>
            <input v-model="cv.philhealthNo" class="form-control" />
          </div>
        </div>
        <div class="form-group">
          <label>Civil Status & Dependents</label>
          <input v-model="cv.civilStatus" class="form-control" />
        </div>
        
        <!-- Signature Upload -->
        <div class="form-group">
          <label>Upload Signature (Optional)</label>
          <input type="file" @change="onFileUpload" class="form-control-file" />
          <div v-if="cv.signatureUrl" class="mt-2">
            <img :src="cv.signatureUrl" class="img-thumbnail" style="max-width: 200px;" />
          </div>
        </div>

        <button type="button" @click="nextSection" class="btn btn-primary">Next</button>
      </div>

      <!-- II. EDUCATIONAL BACKGROUND -->
      <div v-if="currentSection === 2">
        <h4>II. Educational Background</h4>
        <div class="form-group">
          <label>College (Degree/Course, School/Location, Year Attended)</label>
          <input v-model="cv.college" class="form-control" />
        </div>
        <div class="form-group">
          <label>Vocational (Degree/Course, School/Location, Year Attended)</label>
          <input v-model="cv.vocational" class="form-control" />
        </div>
        <div class="form-group">
          <label>High School (Degree/Course, School/Location, Year Attended)</label>
          <input v-model="cv.highSchool" class="form-control" />
        </div>
        <div class="form-group">
          <label>Graduate Studies</label>
          <input v-model="cv.graduateStudies" class="form-control" />
        </div>
        <div class="form-group">
          <label>Special Course/Skills</label>
          <input v-model="cv.specialCourse" class="form-control" />
        </div>
        <div class="form-group">
          <label>Computer Literacy</label>
          <input v-model="cv.computerLiteracy" class="form-control" />
        </div>
        <div class="form-group">
          <label>Machine/Station Handled</label>
          <input v-model="cv.machinaHandled" class="form-control" />
        </div>

        <button type="button" @click="prevSection" class="btn btn-secondary">Previous</button>
        <button type="button" @click="nextSection" class="btn btn-primary">Next</button>
      </div>

      <!-- III. SCHOLARSHIP / MERIT AWARD / PROFESSIONAL LICENSES -->
      <div v-if="currentSection === 3">
        <h4>III. Scholarship / Merit Award / Professional Licenses</h4>
        <div class="form-group">
          <label>Scholarship/Award/License</label>
          <input v-model="cv.scholarship" class="form-control" />
        </div>
        <div class="form-group">
          <label>Institution</label>
          <input v-model="cv.institution" class="form-control" />
        </div>

        <button type="button" @click="prevSection" class="btn btn-secondary">Previous</button>
        <button type="button" @click="nextSection" class="btn btn-primary">Next</button>
      </div>

      <!-- IV. FAMILY BACKGROUND -->
      <div v-if="currentSection === 4">
        <h4>IV. Family Background</h4>
        <div class="form-group">
          <label>Spouse (Maiden Name)</label>
          <input v-model="cv.spouse" class="form-control" />
        </div>
        <div class="form-group">
          <label>Mother (Maiden Name)</label>
          <input v-model="cv.mother" class="form-control" />
        </div>
        <div class="form-group">
          <label>Father</label>
          <input v-model="cv.father" class="form-control" />
        </div>

        <button type="button" @click="prevSection" class="btn btn-secondary">Previous</button>
        <button type="button" @click="nextSection" class="btn btn-primary">Next</button>
      </div>

      <!-- V. EMPLOYMENT HISTORY -->
      <div v-if="currentSection === 5">
        <h4>V. Employment History</h4>
        <div class="form-group">
          <label>Employer</label>
          <input v-model="cv.employer" class="form-control" />
        </div>
        <div class="form-group">
          <label>Position</label>
          <input v-model="cv.position" class="form-control" />
        </div>

        <button type="button" @click="prevSection" class="btn btn-secondary">Previous</button>
        <button type="button" @click="nextSection" class="btn btn-primary">Next</button>
      </div>

      <!-- VI. REFERENCES -->
      <div v-if="currentSection === 6">
        <h4>VI. References</h4>
        <div class="form-group">
          <label>Name</label>
          <input v-model="cv.referenceName" class="form-control" />
        </div>

        <button type="button" @click="prevSection" class="btn btn-secondary">Previous</button>
        <button type="button" @click="nextSection" class="btn btn-primary">Next</button>
      </div>

      <!-- VII. DECLARATION -->
      <div v-if="currentSection === 7">
        <h4>VII. Declaration</h4>
        <textarea v-model="cv.declaration" class="form-control" rows="4"></textarea>

        <button type="button" @click="prevSection" class="btn btn-secondary">Previous</button>
        <button type="submit" class="btn btn-primary">Submit CV</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentSection: 1,
      cv: {
        lastName: '',
        firstName: '',
        middleName: '',
        address: '',
        contact: '',
        dob: '',
        pob: '',
        email: '',
        nationalId: '',
        sssNo: '',
        tinNo: '',
        isNewTIN: false,
        pagibigNo: '',
        philhealthNo: '',
        civilStatus: '',
        signatureUrl: '',
        college: '',
        vocational: '',
        highSchool: '',
        graduateStudies: '',
        specialCourse: '',
        computerLiteracy: '',
        machinaHandled: '',
        scholarship: '',
        institution: '',
        spouse: '',
        mother: '',
        father: '',
        employer: '',
        position: '',
        referenceName: '',
        declaration: ''
      }
    }
  },
  methods: {
    nextSection() {
      if (this.currentSection < 7) {
        this.currentSection++;
      }
    },
    prevSection() {
      if (this.currentSection > 1) {
        this.currentSection--;
      }
    },
    async onFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.cv.signatureUrl = reader.result;
      };
      reader.readAsDataURL(file);
    },
    async submitCV() {
      alert('CV Submitted!');
      this.$router.push('/test-selection');
    }
  }
}
</script>

<style scoped>
img {
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 8px;
}
</style>
