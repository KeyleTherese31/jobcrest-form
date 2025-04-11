<template>
  <div :class="['jobseeker-cv-page', theme]">
    <div class="jobseeker-cv-form container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-secondary" @click="goBack">← Back</button>
        <button class="btn btn-outline-light" @click="toggleTheme">
          Toggle {{ theme === 'light' ? 'Dark' : 'Light' }} Mode
        </button>
      </div>

      <img src="@/assets/logo.jpg" alt="JobCrest Logo" class="logo mb-3" />

      <h2 class="text-center mb-4">Curriculum Vitae Form</h2>

      <form @submit.prevent="submitForm">
        <div class="text-center mb-3">
          <strong>Section {{ currentSection }} of {{ totalSections }}</strong>
        </div>
        <!-- Position and Admin Only Section -->
        <div class="form-group">
          <label>Position Applied for:</label>
          <input type="text" v-model="form.position" class="form-control" required />
        </div>
        <div class="form-group">
          <label>Date Applied:</label>
          <input type="date" v-model="form.date_applied" class="form-control" readonly />
        </div>

        <!-- Personal Identity -->
        <fieldset v-show="currentSection === 1" class="mt-4">
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

        <!-- Educational Background -->
        <fieldset v-show="currentSection === 2" class="mt-4">
          <legend>II. EDUCATIONAL BACKGROUND</legend>

          <!-- Detailed Fields -->
          <div class="form-group">
            <label>College</label>
            <div class="form-row">
              <div class="col">
                <input class="form-control" v-model="form.education.college.course" placeholder="Course/Degree" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.education.college.school" placeholder="School/Location" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.education.college.year" placeholder="Year Attended" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Vocational</label>
            <div class="form-row">
              <div class="col">
                <input class="form-control" v-model="form.education.vocational.course" placeholder="Course" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.education.vocational.school" placeholder="School/Location" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.education.vocational.year" placeholder="Year Attended" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>High School</label>
            <div class="form-row">
              <div class="col">
                <input class="form-control" v-model="form.education.highschool.course" placeholder="Course" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.education.highschool.school" placeholder="School/Location" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.education.highschool.year" placeholder="Year Attended" />
              </div>
            </div>
          </div>

          <!-- Simplified Fields -->
          <div class="form-group">
            <label>Graduate Studies</label>
            <input class="form-control" v-model="form.education.graduate.course" placeholder="(If any, just specify details)" />
          </div>

          <div class="form-group">
            <label>Special Course/Skills</label>
            <input class="form-control" v-model="form.education.skills.course" placeholder="List special skills/courses" />
          </div>

          <div class="form-group">
            <label>Computer Literacy</label>
            <input class="form-control" v-model="form.education.computer.course" placeholder="Briefly describe skills/software" />
          </div>

          <div class="form-group">
            <label>Machina/Stn Handled</label>
            <input class="form-control" v-model="form.education.machine.course" placeholder="List machinery/stations handled" />
          </div>
        </fieldset>


        <!-- Scholarships / Licenses -->
        <fieldset v-show="currentSection === 3" class="mt-4">
          <legend>III. SCHOLARSHIPS / LICENSES</legend>
          <div v-for="(item, i) in form.scholarships" :key="i" class="form-row mb-2">
            <div class="col">
              <input class="form-control" v-model="item.title" placeholder="Scholarship/Award/License" />
            </div>
            <div class="col">
              <input class="form-control" v-model="item.institution" placeholder="Institution" />
            </div>
          </div>
        </fieldset>

        <!-- Family Background -->
        <fieldset v-show="currentSection === 4" class="mt-4">
          <legend>IV. FAMILY BACKGROUND</legend>
          <div v-for="(person, key) in familyMembers" :key="key" class="form-group">
            <label>{{ person.label }}</label>
            <div class="form-row">
              <div class="col">
                <input class="form-control" v-model="form.family[key].last_name" placeholder="Last Name" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.family[key].first_name" placeholder="First Name" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.family[key].age" placeholder="Age" />
              </div>
              <div class="col">
                <input class="form-control" v-model="form.family[key].occupation" placeholder="Occupation" />
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Employment History -->
        <fieldset v-show="currentSection === 5" class="mt-4">
          <legend>V. EMPLOYMENT HISTORY</legend>
          <div v-for="(job, i) in form.employment" :key="i" class="form-row mb-2">
            <div class="col">
              <input class="form-control" v-model="job.employer" placeholder="Employer" />
            </div>
            <div class="col">
              <input class="form-control" v-model="job.address" placeholder="Address" />
            </div>
            <div class="col">
              <input class="form-control" v-model="job.position" placeholder="Position" />
            </div>
            <div class="col">
              <input class="form-control" v-model="job.tenure" placeholder="Tenure" />
            </div>
          </div>
        </fieldset>

        <!-- References -->
        <fieldset v-show="currentSection === 6" class="mt-4">
          <legend>VI. REFERENCES</legend>
          <div v-for="(ref, i) in form.references" :key="i" class="form-row mb-2">
            <div class="col">
              <input class="form-control" v-model="ref.name" placeholder="Name" />
            </div>
            <div class="col">
              <input class="form-control" v-model="ref.occupation" placeholder="Occupation" />
            </div>
            <div class="col">
              <input class="form-control" v-model="ref.contact" placeholder="Contact No." />
            </div>
            <div class="col">
              <input class="form-control" v-model="ref.years_known" placeholder="Yrs. Known" />
            </div>
          </div>
        </fieldset>
        
        <!-- Declaration -->
        <fieldset v-show="currentSection === 7" class="mt-4">
          <legend>VII. DECLARATION</legend>
          <p style="font-style: italic;">
            I hereby acknowledge that the above information is true and correct to the best of my knowledge and ability, and any false statements made by me on this application or any supplementary records attached thereto shall be sufficient grounds for disqualification from the company.
          </p>
          <div class="form-group">
            <label>Upload Signature:</label>
            <input type="file" @change="handleSignatureUpload" class="form-control" />
          </div>
        </fieldset>

        <div class="d-flex justify-content-between mt-4">
          <button type="button" class="btn btn-secondary" @click="prevSection" :disabled="currentSection === 1">Previous</button>

          <button v-if="currentSection < totalSections" type="button" class="btn btn-primary" @click="nextSection">Next</button>

          <button v-else type="submit" class="btn btn-success">Submit</button>
        </div>
      </form>
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
      theme: 'light',
      currentSection: 1,
      totalSections: 7,
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
          college: { course: '', school: '', year: '' },
          vocational: { course: '', school: '', year: '' },
          highschool: { course: '', school: '', year: '' },
          graduate: { course: '', school: '', year: '' },
          skills: { course: '', school: '', year: '' },
          computer: { course: '', school: '', year: '' },
          machine: { course: '', school: '', year: '' }
        },
        scholarships: [
          { title: '', institution: '' },
          { title: '', institution: '' }
        ],
        family: {
          spouse: { last_name: '', first_name: '', age: '', occupation: '' },
          mother: { last_name: '', first_name: '', age: '', occupation: '' },
          father: { last_name: '', first_name: '', age: '', occupation: '' }
        },
        employment: [
          { employer: '', address: '', position: '', tenure: '' },
          { employer: '', address: '', position: '', tenure: '' }
        ],
        references: [
          { name: '', occupation: '', contact: '', years_known: '' },
          { name: '', occupation: '', contact: '', years_known: '' }
        ],
        signature: null
      },
      familyMembers: {
        spouse: { label: 'Spouse (Maiden Name)' },
        mother: { label: 'Mother (Maiden Name)' },
        father: { label: 'Father' }
      },
      educationLevels: [
        { label: 'College', key: 'college' },
        { label: 'Vocational', key: 'vocational' },
        { label: 'High School', key: 'highschool' },
        { label: 'Graduate Studies', key: 'graduate' },
        { label: 'Special Course/Skills', key: 'skills' },
        { label: 'Computer Literacy', key: 'computer' },
        { label: 'Machina/Stn Handled', key: 'machine' }
      ]
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    },
    nextSection() {
      if (this.currentSection < this.totalSections) this.currentSection++;
    },
    prevSection() {
      if (this.currentSection > 1) this.currentSection--;
    },
    async submitForm() {
    // 1. Insert main profile
    const { data: profileData, error: profileError } = await supabase
      .from('jobseeker_profiles')
      .insert([{
        position_applied: this.form.position,
        date_applied: this.form.date_applied,
        last_name: this.form.last_name,
        first_name: this.form.first_name,
        middle_name: this.form.middle_name,
        address: this.form.address,
        contact_no: this.form.contact_no,
        dob: this.form.dob,
        pob: this.form.pob,
        email: this.form.email,
        national_id: this.form.national_id,
        sss_no: this.form.sss_no,
        tin_no: this.form.tin_no,
        tin_new: this.form.tin_new,
        pagibig: this.form.pagibig,
        philhealth: this.form.philhealth,
        civil_status: this.form.civil_status
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Profile insert error:', profileError);
      return;
    }

    const profileId = profileData.id;
    localStorage.setItem('profileId', profileId);

    // 2. Insert education
    for (const level of Object.keys(this.form.education)) {
      const entry = this.form.education[level];
      if (entry.course || entry.school || entry.year) {
        await supabase.from('educational_background').insert([{
          profile_id: profileId,
          level,
          course: entry.course,
          school: entry.school,
          year: entry.year
        }]);
      }
    }

    // 3. Insert scholarships
    for (const sch of this.form.scholarships) {
      if (sch.title || sch.institution) {
        await supabase.from('scholarships').insert([{
          profile_id: profileId,
          title: sch.title,
          institution: sch.institution
        }]);
      }
    }

    // 4. Insert family members
    for (const key of Object.keys(this.form.family)) {
      const person = this.form.family[key];
      if (person.first_name || person.last_name) {
        await supabase.from('family_background').insert([{
          profile_id: profileId,
          relation: key,
          last_name: person.last_name,
          first_name: person.first_name,
          age: person.age,
          occupation: person.occupation
        }]);
      }
    }

    // 5. Insert employment history
    for (const job of this.form.employment) {
      if (job.employer || job.position) {
        await supabase.from('employment_history').insert([{
          profile_id: profileId,
          employer: job.employer,
          address: job.address,
          position: job.position,
          tenure: job.tenure
        }]);
      }
    }

    // 6. Insert references (to reference_contacts)
    for (const ref of this.form.references) {
      if (ref.name || ref.occupation) {
        await supabase.from('reference_contacts').insert([{
          profile_id: profileId,
          name: ref.name,
          occupation: ref.occupation,
          contact: ref.contact,
          years_known: ref.years_known
        }]);
      }
    }

    // 7. Upload signature (optional)
    if (this.form.signature) {
      const { data: fileData, error: fileError } = await supabase.storage
        .from('signatures') // your Supabase bucket name
        .upload(`signatures/${profileId}_${this.form.signature.name}`, this.form.signature);

      if (!fileError) {
        const { publicURL } = supabase.storage
          .from('signatures')
          .getPublicUrl(fileData.path);

        await supabase.from('signatures').insert([{
          profile_id: profileId,
          file_name: this.form.signature.name,
          file_url: publicURL
        }]);
      }
    }

    alert('CV Submitted Successfully!');
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.jobseeker-cv-page.light {
  background-color: #c0def8;
  color: #000;
}
.jobseeker-cv-page.dark {
  background-color: #002874;
  color: #fff;
}
.jobseeker-cv-form {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  background: inherit;
  border-radius: 8px;
  padding: 1rem;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-row .col {
    width: 100%;
    margin-bottom: 0.75rem;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }

  .logo {
    width: 100px;
    height: auto;
  }

  .btn {
    width: 100%;
  }
}
</style>
