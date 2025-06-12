async function loadStatistics() {
  try {
    const [jobsResponse, companiesResponse] = await Promise.all([
      fetch('http://localhost:3000/public-jobs'),
      fetch('http://localhost:3000/company-count')
    ]);

    if (!jobsResponse.ok || !companiesResponse.ok) {
      throw new Error('Failed to fetch statistics');
    }

    const jobs = await jobsResponse.json();
    const companies = await companiesResponse.json();

    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = `
      <div class="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full mb-4">
          <i class="ri-briefcase-line ri-lg text-primary"></i>
        </div>
        <h3 class="text-4xl font-bold text-gray-800 mb-2">${jobs.length}</h3>
        <p class="text-gray-600">Total Job Postings</p>
      </div>
      <div class="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 flex items-center justify-center bg-green-100 rounded-full mb-4">
          <i class="ri-user-star-line ri-lg text-green-600"></i>
        </div>
        <h3 class="text-4xl font-bold text-gray-800 mb-2">1,423</h3>
        <p class="text-gray-600">Students Placed</p>
      </div>
      <div class="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 flex items-center justify-center bg-amber-100 rounded-full mb-4">
          <i class="ri-calendar-check-line ri-lg text-amber-600"></i>
        </div>
        <h3 class="text-4xl font-bold text-gray-800 mb-2">78</h3>
        <p class="text-gray-600">Upcoming Interviews</p>
      </div>
      <div class="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="w-14 h-14 flex items-center justify-center bg-purple-100 rounded-full mb-4">
          <i class="ri-building-line ri-lg text-purple-600"></i>
        </div>
        <h3 class="text-4xl font-bold text-gray-800 mb-2">${companies.count}</h3>
        <p class="text-gray-600">Registered Companies</p>
      </div>
    `;
  } catch (error) {
    console.error('Error loading statistics:', error);
    document.getElementById('statsContainer').innerHTML = `
      <p class="text-center col-span-4 text-red-500">Error loading statistics</p>
    `;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  loadStatistics();

  fetch('http://localhost:3000/public-jobs')
    .then(response => response.json())
    .then(jobs => {
      const jobList = document.getElementById('jobPostsList');
      jobList.innerHTML = ''; // Clear existing

      if (jobs.length === 0) {
        jobList.innerHTML = '<p class="text-center col-span-3 text-gray-500">No current job openings</p>';
        return;
      }

      jobs.forEach(job => {
        const card = document.createElement('div');
        const location = job.job_location || 'Location not specified';
        const companyName = job.companyId?.name || (typeof job.companyId === 'string' ? job.companyId : 'Company not specified');
        const deadline = new Date(job.deadline).toLocaleDateString();

        card.className = 'bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden';
        card.innerHTML = `
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-md">
                <i class="ri-briefcase-line ri-lg text-primary"></i>
              </div>
              <div class="flex space-x-2">
                <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">${job.job_type}</span>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">${job.job_title}</h3>
            <p class="text-gray-600 mb-4">${companyName}</p>
            <div class="flex items-center text-gray-500 mb-4">
              <div class="flex items-center mr-4">
                <i class="ri-map-pin-line mr-1"></i>
                <span>${location}</span>
              </div>
            </div>
            <p class="text-sm text-gray-500 mb-4">Deadline: ${deadline}</p><a href="/Frontend/placement.html">
            <button class="w-full bg-primary text-white py-2.5 rounded-button font-medium hover:bg-blue-600 transition-colors whitespace-nowrap">Apply Now</button></a>
          </div>
        `;
        jobList.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching jobs:', error);
      document.getElementById('jobPostsList').innerHTML = '<p class="text-center col-span-3 text-red-500">Error loading job posts</p>';
    });
});