import { AcademicDetails, FamilyDetails, Scholarship, StudentProfile } from '../types';

export interface EligibilityResult {
  eligible: boolean;
  message: string;
  reasons: string[];
  matchedCriteria: string[];
}

export function checkScholarshipEligibility(
  scholarship: Scholarship,
  profile?: StudentProfile | null,
  academic?: AcademicDetails | null,
  family?: FamilyDetails | null
): EligibilityResult {
  const reasons: string[] = [];
  const matchedCriteria: string[] = [];

  // Check if profile is complete
  if (!profile || !academic || !family) {
    return {
      eligible: false,
      message: 'Sorry, you are not eligible for this scholarship.',
      reasons: [
        'Your profile is incomplete. Please complete Personal, Academic, and Family details in your Profile to check eligibility.'
      ],
      matchedCriteria: []
    };
  }

  // 1. Scholarship Status Check
  if (scholarship.status === 'Closed') {
    reasons.push('Scholarship application period is closed.');
  } else if (scholarship.status === 'Upcoming') {
    reasons.push('Scholarship applications have not started yet (Upcoming).');
  } else {
    matchedCriteria.push('Scholarship is currently Active');
  }

  // 2. Academic Percentage Check
  const currentPercentage = academic.percentage || (academic.cgpa ? academic.cgpa * 9.5 : 0);
  if (currentPercentage < scholarship.minimumPercentage) {
    reasons.push(
      `Percentage requirement not satisfied (Required: Min ${scholarship.minimumPercentage}%, Your Score: ${currentPercentage.toFixed(1)}%)`
    );
  } else {
    matchedCriteria.push(
      `Academic percentage requirement satisfied (${currentPercentage.toFixed(1)}% >= ${scholarship.minimumPercentage}%)`
    );
  }

  // 3. Family Income Check
  if (family.familyIncome > scholarship.maximumIncome) {
    const formattedMax = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(scholarship.maximumIncome);
    const formattedUser = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(family.familyIncome);
    reasons.push(
      `Family income exceeds limit (Maximum Allowed: ${formattedMax}, Your Family Income: ${formattedUser})`
    );
  } else {
    const formattedMax = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(scholarship.maximumIncome);
    matchedCriteria.push(
      `Family income is within eligible limit (<= ${formattedMax})`
    );
  }

  // 4. Eligible Course Check
  if (scholarship.eligibleCourse && scholarship.eligibleCourse.length > 0 && !scholarship.eligibleCourse.includes('All')) {
    const userCourse = (profile.course || '').trim().toLowerCase();
    const isCourseEligible = scholarship.eligibleCourse.some(c => 
      c.toLowerCase() === userCourse || 
      userCourse.includes(c.toLowerCase()) || 
      c.toLowerCase().includes(userCourse)
    );

    if (!isCourseEligible) {
      reasons.push(`Course not eligible (Eligible courses: ${scholarship.eligibleCourse.join(', ')}, Your course: ${profile.course || 'Not specified'})`);
    } else {
      matchedCriteria.push(`Course matches eligibility (${profile.course})`);
    }
  } else {
    matchedCriteria.push('All academic courses are eligible');
  }

  // 5. Eligible Year Check
  if (scholarship.eligibleYear && scholarship.eligibleYear.length > 0 && !scholarship.eligibleYear.includes('All')) {
    const userYear = (profile.yearOfStudy || '').trim().toLowerCase();
    const isYearEligible = scholarship.eligibleYear.some(y => 
      y.toLowerCase() === userYear || userYear.includes(y.toLowerCase())
    );

    if (!isYearEligible) {
      reasons.push(`Year of study not eligible (Eligible years: ${scholarship.eligibleYear.join(', ')}, Your year: ${profile.yearOfStudy || 'Not specified'})`);
    } else {
      matchedCriteria.push(`Year of study satisfied (${profile.yearOfStudy})`);
    }
  } else {
    matchedCriteria.push('Open to all years of study');
  }

  // 6. Eligible State Check
  if (scholarship.eligibleState && scholarship.eligibleState.length > 0 && !scholarship.eligibleState.includes('All')) {
    const userState = (profile.state || '').trim().toLowerCase();
    const isStateEligible = scholarship.eligibleState.some(s => 
      s.toLowerCase() === userState || userState.includes(s.toLowerCase())
    );

    if (!isStateEligible) {
      reasons.push(`State not eligible (Eligible states: ${scholarship.eligibleState.join(', ')}, Your domicile state: ${profile.state || 'Not specified'})`);
    } else {
      matchedCriteria.push(`Domicile state satisfied (${profile.state})`);
    }
  } else {
    matchedCriteria.push('Open to all States/UTs in India');
  }

  // 7. Gender Eligibility Check
  if (scholarship.genderEligibility && scholarship.genderEligibility !== 'All') {
    if (profile.gender !== scholarship.genderEligibility) {
      reasons.push(`Gender requirement not satisfied (Eligible: ${scholarship.genderEligibility} only, Your profile: ${profile.gender || 'Not specified'})`);
    } else {
      matchedCriteria.push(`Gender criteria met (${profile.gender})`);
    }
  } else {
    matchedCriteria.push('Open to all genders');
  }

  const isEligible = reasons.length === 0;

  return {
    eligible: isEligible,
    message: isEligible
      ? 'Congratulations! You are eligible for this scholarship.'
      : 'Sorry, you are not eligible for this scholarship.',
    reasons,
    matchedCriteria
  };
}
