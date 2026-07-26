/* eslint-disable */
// Minimal LinkedIn client for the "post an image with commentary" flow.
//
// Publishing an image post is three calls, in order:
//   1. POST /rest/images?action=initializeUpload  -> upload URL + image URN
//   2. PUT  <uploadUrl>                           -> the raw PNG bytes
//   3. POST /rest/posts                           -> the post, referencing the URN
//
// Requires a member access token with the w_member_social scope. Tokens are
// short-lived (~60 days) and cannot be minted here — see README.md.
const API = 'https://api.linkedin.com';

// LinkedIn requires an explicit version header and rejects unknown values, so
// this is pinned rather than tracking "latest". Bump deliberately.
const LINKEDIN_VERSION = process.env.LINKEDIN_API_VERSION || '202401';

function headers(token, extra = {}) {
  return {
    Authorization: `Bearer ${token}`,
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': LINKEDIN_VERSION,
    ...extra,
  };
}

async function readError(res) {
  let body = '';
  try {
    body = await res.text();
  } catch (_) {
    /* ignore */
  }
  return `${res.status} ${res.statusText}${body ? ` — ${body.slice(0, 500)}` : ''}`;
}

/** Step 1: reserve an upload slot, returning { uploadUrl, imageUrn }. */
async function initializeUpload({ token, authorUrn }) {
  const res = await fetch(`${API}/rest/images?action=initializeUpload`, {
    method: 'POST',
    headers: headers(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ initializeUploadRequest: { owner: authorUrn } }),
  });
  if (!res.ok) throw new Error(`initializeUpload failed: ${await readError(res)}`);

  const json = await res.json();
  const value = json && json.value;
  if (!value || !value.uploadUrl || !value.image) {
    throw new Error(`initializeUpload returned an unexpected body: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return { uploadUrl: value.uploadUrl, imageUrn: value.image };
}

/** Step 2: PUT the bytes. LinkedIn returns 201 with an empty body on success. */
async function uploadImage({ uploadUrl, token, buffer }) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'image/png' },
    body: buffer,
  });
  if (!res.ok) throw new Error(`image upload failed: ${await readError(res)}`);
}

/** Step 3: publish the post. Returns the post URN. */
async function createImagePost({ token, authorUrn, commentary, imageUrn, altText }) {
  const res = await fetch(`${API}/rest/posts`, {
    method: 'POST',
    headers: headers(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      author: authorUrn,
      commentary,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: { media: { id: imageUrn, altText } },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
  });
  if (!res.ok) throw new Error(`post creation failed: ${await readError(res)}`);
  return res.headers.get('x-restli-id') || res.headers.get('x-linkedin-id') || '(urn not returned)';
}

/** Full publish flow. */
async function publish({ token, authorUrn, commentary, imageBuffer, altText }) {
  const { uploadUrl, imageUrn } = await initializeUpload({ token, authorUrn });
  await uploadImage({ uploadUrl, token, buffer: imageBuffer });
  const postUrn = await createImagePost({ token, authorUrn, commentary, imageUrn, altText });
  return { postUrn, imageUrn };
}

module.exports = { publish, initializeUpload, uploadImage, createImagePost, LINKEDIN_VERSION };
