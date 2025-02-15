# ConsultAI Guide - Medical Consultation & Diet Planning Platform

## Overview

ConsultAI Guide is a comprehensive medical consultation platform that combines AI-powered medical assessments with personalized diet planning. The platform provides users with virtual medical consultations, generates detailed medical reports, and creates customized diet plans based on individual health conditions and requirements.

## Features

### 1. Virtual Medical Consultations
- Real-time chat interface with AI medical assistant
- Dynamic symptom assessment and analysis
- Comprehensive medical report generation
- Session history tracking and management
- Secure and private conversations

### 2. Medical Reports
- Detailed diagnosis and condition analysis
- Medication recommendations with dosage instructions
- Treatment plans and follow-up schedules
- Precautions and warning signs
- Downloadable report formats

### 3. Personalized Diet Plans
- Condition-specific diet recommendations
- Detailed meal planning with exact portions
- Nutritional guidelines and restrictions
- Supplement recommendations
- Food-drug interaction considerations
- Hydration schedules

### 4. Dashboard Features
- User profile management
- Consultation history
- Report archives
- Diet plan tracking
- Assessment history
- Basic health information storage

## Technology Stack

### Frontend
- React with TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- Shadcn UI components
- Lucide icons

### Backend
- Supabase for database and authentication
- Google's Generative AI (Gemini Pro) for medical analysis
- RESTful API architecture

### Key Libraries
- date-fns for date manipulation
- @google/generative-ai for AI integration
- Various UI components from shadcn/ui

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Google AI (Gemini) API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/consultai-guide.git
cd consultai-guide
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/
│   ├── chat/
│   ├── dashboard/
│   ├── landing/
│   └── ui/
├── lib/
│   ├── auth.ts
│   ├── gemini.ts
│   ├── diet-plans.ts
│   ├── reports.ts
│   └── supabase.ts
├── pages/
│   └── dashboard/
├── types/
└── hooks/
```

## Key Features Implementation

### Medical Consultation
- Real-time chat interface with AI
- Dynamic question generation based on symptoms
- Medical report generation using Gemini AI
- Session management and history tracking

### Diet Plan Generation
- Condition-specific diet recommendations
- Detailed meal planning with portions
- Nutritional guidelines and restrictions
- Food-drug interaction analysis
- Supplement recommendations

### Report Management
- Automated report generation
- PDF export functionality
- Historical report tracking
- Diet plan integration

## Security Features

- Secure authentication via Supabase
- Protected routes and authorized access
- Encrypted data transmission
- HIPAA-compliant data storage (where applicable)
- User data privacy protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Google Generative AI (Gemini) for medical analysis
- Supabase for backend infrastructure
- Shadcn UI for component library
- All contributors and maintainers

## Support

For support, please email support@consultai-guide.com or open an issue in the repository.

## Roadmap

- [ ] Integration with wearable devices
- [ ] Mobile application development
- [ ] Multi-language support
- [ ] Video consultation features
- [ ] Integration with electronic health records
- [ ] Advanced analytics dashboard

## Disclaimer

This application is for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
