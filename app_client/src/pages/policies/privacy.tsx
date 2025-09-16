export function PrivacyPolicy() {

    const CompanyName = (import.meta as any).env.VITE_COMPANY_NAME
    const InfoContact = (import.meta as any).env.VITE_COMPANY_INFO_CONTACT
    const TeamContact = (import.meta as any).env.VITE_COMPANY_INFO_CONTACT

    return (
        <div className={`
		flex flex-col md:w-10/12 w-12/12 m-auto p-1 px-0 text-[9px] md:text-sm
		`}>
            <div className={`
			flex flex-row  w-full p-4 border-b px-1 pb-1
			`}>
                <div className='ml-3 basis-10/12 pb-4'>
                    <span className='text-4xl'>
                        Privacy & Cookies Policy
                    </span>
                </div>
            </div>
            <div className='pb-48 border-b'>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Introduction &amp; General Terms</span></strong>
                    At {CompanyName} we are committed to protecting the personal information we hold about our members, newsletter subscribers and website users or any other data subject whose personal information we hold. Personal information as outlined in this policy is being processed by {CompanyName} Ltd (<strong>“we”, “our”, “us”, “{CompanyName}</strong><strong>”</strong><strong>)</strong>.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Our commitment to you</span></strong>
                    We are committed to managing &amp; safeguarding your personal information in accordance with current legislation and best practice. Our aim is to be responsible, relevant and secure when using your data. Whenever you provide personal information we will treat that information in accordance with this privacy policy. We will process the personal information you have supplied to us to conduct and manage our business to enable us to give you the most appropriate marketing, information, service and products and provide the best and most secure experience. These are what we consider to be our ‘Legitimate Interests’.&nbsp;We endeavour at all times to keep your data accurate and secure, and to honour your data preferences with regard to receipt of direct marketing e.g. email.</p>
                <p>We operate websites that may contain hyperlinks to websites owned and operated by third parties. These third party websites have their own privacy policies, and are also likely to use cookies, and we therefore urge you to review them. They will govern the use of personal information you submit when visiting these websites, which may also be collected by cookies. We do not accept any responsibility or liability for the privacy practices of such third party websites and your use of such websites is at your own risk.</p>
                <p>We reserve the right to revise or amend this Privacy Policy at any time to reflect changes to our business or changes in the law. &nbsp;Where these changes are significant we will endeavour to email all of our registered users to make sure that they are informed of such changes. However, it is your responsibility to check this Privacy Policy before each use of the {CompanyName} website.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Who we are</span></strong>
                    {CompanyName} is an education resource website that aims to help students revise for GCSE, A Level, and University (Level 6) exams; primaraly for STEM subjects. {CompanyName} Also aims to be a resource management and distribution tool for independant educators (Tutors), small organisations (Tuition centers) and Schools.</p>
                <p id='yourdata'><strong><span className='block text-2xl mt-3 mb-1'>What data we collect</span></strong>
                    When you send us information, submit an online form or when you visit our website, we may collect both personal and pseudonymous data about you.<br />
                    When we talk about personal data we mean any information that can identify you as an individual, such as your name and postal address. Pseudonymous data doesn’t identify you as a person but it might be used in aggregate, for instance when you participate in a survey or when we analyse audience interaction with our products and services.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Data you provide to us</span></strong>
                    When you participate in, access, purchase or sign up to any of our services, activities or online content, such as membership subscriptions, newsletters, competitions or events, we receive personal information about you. This can consist of information such as your name, email address, postal address, telephone or mobile number and school, as well as information collected about your use of our services (such as when you enter our sites and how long you stay on them).</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Data we collect through your use of our websites</span></strong>
                    We may collect information about how you use our websites or other content online, and the device(s) you use to access the services. This includes collecting unique online identifiers such as IP addresses, which are numbers that can uniquely identify a specific computer or other network device on the internet. Anonymous data will be recorded for the purpose of reporting web traffic statistics, advertisement ‘click-throughs’, and/or other activities on our sites.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>How we use your data</span></strong>
                    We may use the information you share with us and the information we collect through your use of our sites in the ways described below and as described at the time of capture.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Personalisation</span></strong>
                    We will use the data collected from your direct interaction with the website in order to personalise your experince, those interactions include but are not limited to: Time spent studying on a page, Number of questions answered etc.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Newsletters</span></strong>
                    We will use the details you have shared to send you the newsletter to which you have subscribed. We will provide a way for you to unsubscribe on every newsletter we send to you. Details you share with us for the purpose of newsletter subscription will never be shared with a third party.</p>
                <p><span className='block text-2xl mt-3 mb-1'><strong>Events</strong></span>
                    We will use the details you have shared to manage your registration and entry into our event. This may include contact via telephone, email, SMS and post with information relating to the event you have registered to attend. Your data will not be added to any marketing lists unless you have consented to this, and will only be shared with a third party where they were named at the point of data capture and you explicitly agreed to the sharing of your data or where they are a third party who we have appointed to manage the delivery of the event.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Membership Subscription</span></strong>
                    We will use the details you have shared to manage your subscription to our website, which includes sending you login details, managing access to your online account, taking secure payments, sending you details on how to use your membership subscription and achieve the most out of your revision, to handle any customer query you may have and to contact you via telephone, email, SMS and post with information relating to your membership subscription. e.g. to notify you of the expiry date of your subscription or to remind you of a password or to notify you of updates to our privacy policy.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Customer Services</span></strong>
                    We will use the information you provide to deliver customer services related to your purchase and to respond to inquiries or requests that you direct to us. Your data will not be added to any marketing lists unless you have consented to this, and will only be shared with third parties where we have appointed them to manage specific aspects of your customer care.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Research</span></strong>
                    We may use the information you provide to invite you to participate in surveys and focus groups about our products, advertisers and services. Participation is always voluntary and the answers you provide are anonymous and aggregated to support our learnings and inform changes we can make to improve our products and services. Your data will not be added to any marketing lists unless you have consented to this and were informed at the point of capture and will only be shared with third parties where we have appointed them to manage research activity on our behalf.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Direct Marketing</span></strong>
                    We may use the details you share with us to send you offers and promotions by email, post, telephone or SMS wherever we have legitimate interest grounds to do so &nbsp;and where you have not objected. We will provide a way for you to opt-out of receiving marketing promotions both at the time of data capture and everytime we contact you thereafter. You can also email&nbsp;{TeamContact} to request your details are suppressed from all promotional campaigns. We won’t use your personal data for marketing purposes at all if you’ve told us not to.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Legitimate Interest</span></strong>
                    We may process your personal data on the basis of a legitimate interest which may include promoting similar products or services via direct marketing activity, to manage supression and unsubscribe requests received from you, to identify and prevent fraudulent behaviour, maintaining the security of our system, data analytics, enhancing, modifying or improving our services, identifying usage trends and determining the effectiveness of our campaigns.<br />
                    Whenever we process data for these purposes we will ensure that we always keep your personal data rights in high regard and take account of these rights.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Cookies Policy</span></strong>
                    We use cookies and similar technologies across our website to improve its performance and enhance your user experience. This policy explains how we do that.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>What are cookies?</span></strong>
                    Cookies are small text files which a website may put on your computer or mobile device when you visit a site or page. The cookie will help the website, or another website, to recognise your device the next time you visit. Web beacons or other similar files can also do the same thing. We use the term “cookies” in this policy to refer to all files that collect information in this way.</p>
                <p>Cookies serve many functions. For example, they can help us to remember your username and preferences, analyse how well our website is performing, or even allow us to recommend content we believe will be most relevant to you.</p>
                <p>Certain cookies may record personal information – for example, if you click “Remember me” when logging in, a cookie will store your username. Most cookies won’t collect information that identifies you personally, and will instead allow us to collect more general information such as how users arrive at and use our websites.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>What sort of cookies does {CompanyName} use?</span></strong>
                    Generally, our cookies perform up to three different functions:</p>
                <p><strong>1. Essential cookies</strong><br />
                    These cookies are essential in order to enable you to move around the website and use its features, such as accessing secure areas of the website. Without these cookies services you have asked for, like shopping baskets or e-billing, cannot be provided. Because some website features will not function without cookies of this type, they are designated as ‘strictly necessary’ and are exempted from the regulations which require your consent to place cookies on your device.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>2. Performance Cookies</span></strong>
                    These cookies allow us to collect information about how visitors use a website, for instance which pages visitors visit most often, and if they get error messages from web pages. These cookies don’t record information that personally identifies a visitor. All information these cookies record is aggregated and anonymous. It is only used to improve how a website works.<br />
                    <strong>By using the {CompanyName} website you agree we may place these types of cookies on your device, unless you have disabled them.</strong></p>
                <p><strong>3. Functionality Cookies</strong><br />
                    These cookies allow a website to remember choices you make (such as your user name, language or the region you are in) and provide enhanced, personalised features. For instance, a website may be able to provide you with local weather reports or traffic news by storing in a cookie the region in which you are currently located. These cookies can also be used to remember changes you have made to text size, fonts and other parts of web pages that you can customise. They may also be used to provide services you have asked for such as watching a video or commenting on a blog. The information these&nbsp;cookies record may be anonymised and they cannot track your browsing activity on other websites.<br />
                    <strong>By using the {CompanyName} website you agree we may place these types of cookies on your device, unless you have disabled them.</strong></p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Does anyone else use cookies on the {CompanyName} website?</span></strong>
                    We also use or allow third parties to serve cookies that fall into the three categories above. For example, like many companies, we use Google Analytics to help us monitor our website traffic. We may also use third party cookies to help us with market research, revenue tracking, improving site functionality and monitoring compliance with our terms and conditions and copyright policy.</p>
                <p>If you click on a hyperlink from the {CompanyName} website to any third party websites (e.g. if you ‘share’ content from the {CompanyName} website with friends or colleagues through social networks), you may be sent cookies from these third party websites. &nbsp;Third party websites have their own privacy and cookie policies which {CompanyName} cannot control. Please check the third-party websites for more information about their cookies and how to manage them.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Can a website user block cookies?</span></strong>
                    As we’ve explained above, cookies help you to get the most out of our websites.</p>
                <p>The first time you access our website after 29 April 2022, you should see a banner which explains that by continuing to access our sites, you are consenting to our use of cookies.</p>
                <p>However, if you do wish to disable our cookies then please follow the instructions on&nbsp;<a href="http://www.aboutcookies.org/">www.aboutcookies.org</a>.</p>
                <p>Please remember that if you do choose to disable cookies, you may find that certain sections of our website do not work properly.</p>
                <p><span className='block text-2xl mt-3 mb-1'><strong>Do we track whether users open our emails?</strong></span>
                    Our emails may contain a single, campaign-unique “pixel” to tell us whether our emails are opened and verify any clicks through to links or advertisements within the email. We may use this information for purposes including determining which of our emails are more interesting to users, to query whether users who do not open our emails wish to continue receiving them and to inform our advertisers in aggregate how many users have clicked on their advertisements. The pixel will be deleted when you delete the email.</p>
                <p><strong><span className='block text-2xl mt-3 mb-1'>Analytics</span></strong>
                    The {CompanyName} website uses Google Analytics as its primary solution for tracking website visits, interactions and events. {CompanyName} uses website analytics data to help improve the way we delivery content and online experiences to visitors.</p>
                <p>For full details on how Google processes your data please visit:&nbsp;<a href="https://support.google.com/analytics/topic/2919631?hl=en&amp;ref_topic=1008008" target="blank">https://support.google.com/analytics/topic/2919631?hl=en&amp;ref_topic=1008008</a></p>
                <p><span className='block text-2xl mt-3 mb-1'><strong>Links to other websites&nbsp;</strong></span>
                    This privacy notice does not cover the links within this site linking to other websites. Those sites are not governed by this privacy policy, and if you have questions about how a site uses your information, you’ll need to check that site’s privacy statement.</p>
                <p><span className='block text-2xl mt-3 mb-1'><strong>How we keep your personal data secure</strong></span>
                    {CompanyName}’s security policies, rules and technical measures have been implemented to protect your personal information from unauthorised or improper use and from accidental loss.<br />
                    All our employees and data processors that have access to, and are associated with, the processing of your personal information are legally obliged to respect the confidentiality of your data.<br />
                    Note that our website provides commenting facilities where you can post information. When you do so, be aware that other visitors may collect any information you make public.</p>

                <p><span className='block text-2xl mt-3 mb-1'><strong>Who we share your personal data with</strong></span>
                    {CompanyName} has a variety of carefully selected companies that we share data with in order to carry out the activities described in the section How we use your data. These companies include but are not limited to Google and Stripe. These companies are not governed by this privacy policy, and if you have questions about how they use your information, you’ll need to check their privacy statement. <br /><br />

                    Our service uses YouTube API Services. By using our service, you agree to the terms of service. For more details, please review YouTube's Terms of Service at the following URL: <a href="https://www.youtube.com/t/terms" className='text-blue-500 hover:cursor-pointer hover:underline ml-1'>https://www.youtube.com/t/terms</a><br /><br />


                    Aditionally our use of YouTube API Services subjects you to Google's Privacy Policy. Therfore by using our service and agreeing to our privacy and terms policies, you also concent to Google's Privacy Policy. For more information, please review Google's Privacy Policy at the following URL: <a href="http://www.google.com/policies/privacy" className='text-blue-500 hover:cursor-pointer hover:underline ml-1'>http://www.google.com/policies/privacy</a><br /><br />

                </p>

                <p><span className='block text-2xl mt-3 mb-1'><strong>How long we keep your personal data for</strong></span>
                    We will hold your personal information on our systems only for as long as required to provide you with the products and/or services you have requested.</p>
                <p>Where you sign up to receive email marketing from us we will retain your e-mail address after you ‘opt-out’ of receiving emails in order to ensure that we continue to honour and respect that request. To unsubscribe from marketing emails at any time, please click on the unsubscribe link at the bottom of any marketing email. You may also contact us at <a href="mailto:{InfoContact}">{InfoContact}</a> to inform us if you do not wish to receive any marketing materials from us.</p>
                <p>In some circumstances you can ask us to delete your data: see “Your rights” below for further information.</p>
                <p>In some circumstances we may anonymise your personal data (so that it can no longer be associated with you) for research or statistical purposes in which case we may use this information indefinitely without further notice to you.</p>
                <p><span className='block text-2xl mt-3 mb-1'><strong>Personal Data – Your rights</strong></span>
                    Under the&nbsp;GDPR&nbsp;&nbsp;including any implementing data protection &nbsp;legislation in the UK you have the rights shown below:-</p>
                <ol className='ml-3'>
                    <li>Your right to be informed</li>
                    <li>Your right of access</li>
                    <li>Your right to rectification</li>
                    <li>Your right to erasure</li>
                    <li>Your right to restrict processing</li>
                    <li>Your right to data portability</li>
                    <li>Your right to object</li>
                    <li>Your rights in relation to automated decision making and profiling.</li>
                </ol>
                <p><strong>Right of Access</strong><br />
                    You may, at any time, request access to the personal data that we hold which relates to you (you may have heard of this right being described as a&nbsp;<strong>“subject access request”</strong>).</p>
                <p>You can exercise this right at any time by writing to our Privacy Officer at <a href="mailto:{InfoContact}">{InfoContact}</a> and telling us that you are making a subject access request. You do not have to fill in a specific form to make this kind of request.</p>
                <p><strong>Your Right to Rectification and Erasure</strong><br />
                    You may, at any time, request that we correct personal data that we hold about you which you believe is incorrect or inaccurate. You may also ask us to erase personal data if you do not believe that we need to continue retaining it (you may have heard of this right described as the “right to be forgotten”).</p>
                <p>Please note that we may ask you to verify any new data that you provide to us and may take our own steps to check that the new data you have supplied us with is right. Further, we are not always obliged to erase personal data when asked to do so; if for any reason we believe that we have a good legal reason to continue processing personal data that you ask us to erase we will tell you what that reason is at the time we respond to your request.</p>
                <p>You can exercise this right at any time by writing to our Privacy Officer at <a href="mailto:{InfoContact}">{InfoContact}</a> and telling us that you are making a request to have your personal data rectified or erased and on what basis you are making that request. If you want us to replace inaccurate data with new data, you should tell us what that new data is. You do not have to fill in a specific form to make this kind of request.</p>
                <p><strong>Your Right to Restrict Processing</strong><br />
                    Where we process your personal data on the basis of a legitimate interest (see the How we use your data section of this Policy which explains why we use your personal data) you are entitled to ask us to stop processing it in that way if you feel that our continuing to do so impacts on your fundamental rights and freedoms or if you feel that those legitimate interests are not valid.</p>
                <p>You may also ask us to stop processing your personal data (a) if you dispute the accuracy of that personal data and want us to verify that data’s accuracy; (b) where it has been established that our use of the data is unlawful but you do not want us to erase it; (c) where we no longer need to process your personal data (and would otherwise dispose of it) but you wish for us to continue storing it in order to enable you to establish, exercise or defend legal claims.</p>
                <p>Please note that if for any reason we believe that we have a good legal reason to continue processing personal data that you ask us to stop processing, we will tell you what that reason is, either at the time we first respond to your request or after we have had the opportunity to consider and investigate it.</p>
                <p>You can exercise this right at any time by writing to our Privacy Officer at <a href="mailto:{InfoContact}">{InfoContact}</a> and telling us that you are making a request to have us stop processing the relevant aspect of your personal data and describing which of the above conditions you believe is relevant to that request. You do not have to fill in a specific form to make this kind of request.</p>
                <p><strong>Your Right to Portability</strong><br />
                    Where you wish to transfer certain personal data that we hold about you, which is processed by automated means, to a third party you may write to us and ask us to provide it to you in a commonly used machine-readable format.</p>
                <p>Because of the kind of work that we do and the systems that we use, we do not envisage this right being particularly relevant to the majority of individuals with whom we interact. However, if you wish to transfer your data from us to a third party we are happy to consider such requests.</p>
                <p><strong>Your Right to stop receiving communications</strong><br />
                    For details on your rights to ask us to stop sending you various kinds of communications,&nbsp;please contact our Privacy Officer at <a href="mailto:{InfoContact}">{InfoContact}</a></p>
                <p><strong>Your Right to object to automated decision making and profiling</strong><br />
                    You have the right to be informed about the existence of any automated decision making and profiling of your personal data, and where appropriate, be provided with meaningful information about the logic involved, as well as the significance and the envisaged consequences of such processing that affects you.</p>
                <p><strong>Exercising your rights</strong><br />
                    If you wish to exercise any of these rights &nbsp;or simply wish to find out what information, if any, we hold that relates to you, you must make your request in writing by sending an email to our Privacy Officer at <a href="mailto:{TeamContact}">{TeamContact}</a>.</p>
                <p>You can help us to process your request quickly by providing us with information that will help us identify records we hold that relate to you. For example your name, username, email address, telephone number or in the case of information captured via cookies, the IP address of the device you have used.</p>
                <p>If we decide to change our privacy policy &nbsp;we will post these changes on this page so that you are always aware of what information we collect, how we use it and in what circumstances we disclose it.</p>
                <p><span className='block text-2xl mt-3 mb-1'><strong>Changes to our privacy &amp; cookies policy&nbsp;</strong></span>
                    We keep our privacy &amp; cookies policy under regular review. This privacy &amp; cookies policy was last updated on 26 May 2024.</p>
            </div>
        </div>
    )
}


export default PrivacyPolicy
