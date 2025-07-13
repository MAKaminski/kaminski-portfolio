# GitHub Issues - Portfolio Website Features

## Issue #1: Add AI Chatbot for Q&A
**Status**: ✅ Implemented  
**Priority**: High  
**Labels**: `enhancement`, `ai`, `user-experience`

### Description
Add an AI chatbot that can answer questions about Michael's experience, skills, and background as if it were him.

### Requirements
- [x] Chat interface with floating button
- [x] Knowledge base covering experience, skills, compensation, location, industries
- [x] Natural language processing for question matching
- [x] Typing indicators and smooth animations
- [x] Mobile-responsive design
- [x] Professional UI with brand colors

### Technical Implementation
- React component with Framer Motion animations
- Keyword-based response system
- Local state management for messages
- Auto-scroll to latest messages
- Simulated typing delays for realism

### Files Modified
- `src/components/AIChatbot.tsx` (new)
- `src/App.tsx` (added import)

---

## Issue #2: Implement Calendar Integration for Scheduling
**Status**: ✅ Implemented  
**Priority**: High  
**Labels**: `enhancement`, `integration`, `user-experience`

### Description
Replace the "Schedule a Call" button with a functional link to a calendar scheduling app.

### Requirements
- [x] Link to Calendly or similar scheduling platform
- [x] Opens in new tab
- [x] Professional calendar integration
- [x] Maintains existing button styling

### Implementation
- Updated Contact component to use Calendly link
- Added Calendar icon from Lucide React
- Link: `https://calendly.com/mkaminski1337/executive-consultation`

### Files Modified
- `src/components/Contact.tsx`

---

## Issue #3: Update Contact Information
**Status**: ✅ Implemented  
**Priority**: Medium  
**Labels**: `bug`, `content`

### Description
Update contact information with real phone number and email address.

### Requirements
- [x] Phone: (404) 838-8613
- [x] Email: mkaminski1337@gmail.com
- [x] Clickable phone and email links
- [x] Update LinkedIn profile link

### Implementation
- Added `tel:` and `mailto:` links
- Updated LinkedIn to: `linkedin.com/in/michaelxaxkaminski`
- Added hover effects for better UX

### Files Modified
- `src/components/Contact.tsx`
- `src/components/Hero.tsx` (LinkedIn link)

---

## Issue #4: Implement Salary Censorship Effect
**Status**: ✅ Implemented  
**Priority**: Medium  
**Labels**: `enhancement`, `ui`, `privacy`

### Description
Apply a censorship effect to salary and bonus numbers that can be revealed on hover/click.

### Requirements
- [x] Blur effect on salary numbers
- [x] Toggle reveal/hide functionality
- [x] Eye icon for visual indication
- [x] Smooth animations
- [x] Apply to both hero and contact sections

### Technical Implementation
- Created `CensoredNumber` component
- Uses CSS blur filter and state management
- Eye/EyeOff icons from Lucide React
- Hover animations with Framer Motion

### Files Modified
- `src/components/CensoredNumber.tsx` (new)
- `src/components/Hero.tsx`
- `src/components/Contact.tsx`

---

## Future Enhancements

### Issue #5: Advanced AI Integration
**Status**: 🔄 Planned  
**Priority**: Medium  
**Labels**: `enhancement`, `ai`, `future`

### Description
Integrate with OpenAI API for more sophisticated responses.

### Requirements
- [ ] OpenAI API integration
- [ ] Context-aware responses
- [ ] Conversation memory
- [ ] Rate limiting and error handling

### Issue #6: Analytics Integration
**Status**: 🔄 Planned  
**Priority**: Low  
**Labels**: `enhancement`, `analytics`

### Description
Add analytics to track chatbot usage and user interactions.

### Requirements
- [ ] Google Analytics integration
- [ ] Chat interaction tracking
- [ ] User journey analysis
- [ ] Performance metrics

### Issue #7: Multi-language Support
**Status**: 🔄 Planned  
**Priority**: Low  
**Labels**: `enhancement`, `internationalization`

### Description
Add support for multiple languages in the chatbot.

### Requirements
- [ ] i18n framework integration
- [ ] Language detection
- [ ] Translated responses
- [ ] Language switcher UI