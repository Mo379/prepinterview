function TCPolicy() {
    const SiteURL = (import.meta as any).env.VITE_SITE_URL
    const CompanyName = (import.meta as any).env.VITE_COMPANY_NAME
    const CompanyNumber = (import.meta as any).env.VITE_COMPANY_NUMBER

    return (
        <div className={`
		flex flex-col md:w-10/12 w-12/12 m-auto p-1 px-0 text-[9px] md:text-sm
		`}>
            <div className={`
			flex flex-row  w-full p-4 border-b px-1 pb-1
			`}>
                <div className='ml-3 basis-10/12'>
                    <span className='text-4xl'>
                        Terms and Conditions
                    </span>
                </div>

            </div>

            <div className='pb-48 border-b'>
                <ol>
                    <li><strong>ABOUT US AND OUR SERVICE</strong></li>
                </ol>

                <p className='ml-1 mt-1'> 1.1. {CompanyName} Ltd (company number {CompanyNumber}, “{CompanyName} ”, “our”, “we”, “the Company”) is a company registered in England and Wales.</p>
                <p className='ml-1 mt-1'>1.2. We operate the website {SiteURL} related subdomains (referred to collectively here as “the Site”). Our provision, management and administration of the Site and of any content included therein, including the provision of content and other services to members (as defined in clause 5 below), are referred to in these terms as “the Services”.</p>
                <p className='ml-1 mt-1'>1.3. To contact us, please email our customer support team via the Site.</p>
                <ol start={2}>
                    <li><strong>ABOUT THESE TERMS OF SERVICE</strong></li>
                </ol>
                <p className='ml-1 mt-1'>2.1. Please read these terms of service (“the Terms of Service”) carefully before participating in, accessing or using any of the Services. The Terms of Service apply to the Services. By using the Services you acknowledge that you have read the Terms of Service and agree that the Terms of Service constitute a binding legal agreement between the user (“you”) and {CompanyName}. If you do not agree with the Terms of Service, you must not use the Services.</p>
                <p className='ml-1 mt-1'>2.2. Please read our privacy policy (“the Privacy Policy”) which you can find <a href={`/privacy`}>here</a>. By using the Services you acknowledge that you have read the Privacy Policy and agree to its terms. If you do not agree with the Privacy Policy, you must not use the Services.</p>
                <p className='ml-1 mt-1'><strong>2.3. Your attention is particularly drawn to clauses 4.1 to 4.8 (warnings regarding scope of the Services).</strong></p>
                <p className='ml-1 mt-1'>2.4. The Terms of Service and any dispute arising out of or in connection with the Terms of Service are governed by the laws of England and are subject to the exclusive jurisdiction of the courts of England.</p>
                <ol start={3}>
                    <li><strong>AGE RESTRICTION</strong></li>
                </ol>
                <p className='ml-1 mt-1'>3.1. If you are under 13:</p>
                <p className='ml-1 mt-1'>3.1.1. please do not use the Services; and</p>
                <p className='ml-1 mt-1'>3.1.2. please do not attempt to register for membership (see clause 5 below) or send any information about yourself to the Company, including your name, address, telephone number, or email address.</p>
                <p className='ml-1 mt-1'>3.2. If it comes to our attention that we have unknowingly gathered information from a person under the age of 13, we will delete that information immediately.</p>
                <ol start={4}>
                    <li><strong>HOW TO USE THE SERVICES</strong></li>
                </ol>
                <p className='ml-1 mt-1'><strong>Warnings regarding the scope of the Services</strong></p>
                <p className='ml-1 mt-1'>4.1. The Services, including the content of the Site, are intended for educational and entertainment purposes only. The Services are not intended to, and do not, constitute legal, professional, medical, psychological, therapeutic or healthcare advice or diagnosis or counselling, and may not be used for such purposes.</p>
                <p className='ml-1 mt-1'>4.2. {CompanyName} does not represent or warrant or otherwise agree that the Services will be uninterrupted, error-free, reliable or timely, that defects will be corrected, or that the Services or any relevant server are free of viruses or other harmful components.</p>
                <p className='ml-1 mt-1'>4.3. {CompanyName} does not guarantee that videos or files available for viewing through the Site will be free of contaminating or damaging code such as viruses, trap doors and the like.</p>
                <p className='ml-1 mt-1'>4.4. {CompanyName} does not endorse content, nor warrant the accuracy, completeness, correctness, timeliness or usefulness of any opinions, advice, content, services, or merchandise provided through the Site or on the internet generally.</p>
                <p className='ml-1 mt-1'><strong>4.5. {CompanyName} does not make or provide any guarantee, representation, warranty or any other agreement of any kind, whether express or implied, whether written or oral, that the information and/or any services provided on or through the Site are valid, accurate, correct, complete, exhaustive of any given subject matter or fit for any particular purpose. It is extremely important that you check the information provided and requirements published by any relevant exam board(s) and school in order to ensure the accuracy, validity, completeness, exhaustiveness and fitness for any particular purpose of the information appearing on or any services provided through the Site. You rely on all and any such content and/or services strictly at your own risk.</strong></p>
                <p className='ml-1 mt-1'><strong>4.6. Any answers or solutions provided on the Site (including model answers or videos) constitute {CompanyName}’s interpretation of an answer and/or solution to a given question. However, those answers and/or solutions are not and are not held out as being the correct or definitive answer to that question. There may be scope for a range of other answers or solutions to that question.</strong></p>
                <p className='ml-1 mt-1'><strong>4.7. {CompanyName} is not liable or responsible in any way if you (or your student(s) or child/children where relevant) incorrectly answer a question in an assignment, exam or any form of formal testing administered by a school or exam board by using a method or procedure featured on the Site, including methods or procedures which do not correspond to the methods or procedures taught at the relevant student’s school (or equivalent educational facility).</strong></p>
                <p className='ml-1 mt-1'><strong>4.8. {CompanyName} does not in any way guarantee any outcome in formal or informal academic testing.</strong></p>
                <p className='ml-1 mt-1'><strong>Restrictions on use</strong></p>
                <p className='ml-1 mt-1'>4.9. When using the Site and the Services you agree not to:</p>
                <p className='ml-1 mt-1'>4.9.1. Modify, download, reproduce, copy or resell any material which is featured on the Site, the Site’s content or any other service offered by {CompanyName}, exemptions apply to specific account types educators (e.g Private Tutors) and small organisations.</p>
                <p className='ml-1 mt-1'>4.9.2. Commercially use the Services, the Site, the content or any portion derivative thereof, exemptions apply to specific account types educators (e.g Private Tutors) and small organisations (e.g Tuition Centers).</p>
                <p className='ml-1 mt-1'>4.9.3. Bypass any measure put in place to prevent or restrict access to any portion of the Site or any other service operated, owned and managed by {CompanyName}.</p>
                <p className='ml-1 mt-1'>4.9.4. Interfere with or damage in any way the operation of the Site, by any means, including uploading viruses, adware, spyware, worms, or other malicious code.</p>
                <p className='ml-1 mt-1'>4.9.5. Use any robot, spider, data miner, crawler, scraper or other automated means to access the Site to collect information from or otherwise interact with the Site.</p>
                <p className='ml-1 mt-1'>4.9.6. Reverse engineer, dissemble, decompile or otherwise attempt to discover the source code or underlying algorithms of all or any part of the Site, {CompanyName}’s Facebook page or any related webhosted service administered, managed and owned by {CompanyName}. The sole exception to this prohibition is where such activity is expressly permitted by applicable law.</p>
                <p className='ml-1 mt-1'>4.9.7. Use the Site, Facebook or any other related service unlawfully, which could damage, disable or impair the Site.</p>
                <p className='ml-1 mt-1'>4.9.8. Use the Site for any illegal purpose, or in violation of any local, state, national, or international law, including, without limitation, laws governing intellectual property and other proprietary rights, and data protection and privacy.</p>
                <p className='ml-1 mt-1'>4.9.9. Collect contact information from the Site, Facebook or any other related service administered, managed and owned by {CompanyName} for the purpose of sending emails, unwarranted messages or for the benefit of any third party.</p>
                <p className='ml-1 mt-1'>4.9.10. Modify or create derivatives of any part of the Site, Facebook or any other service administered, managed and owned by {CompanyName}.</p>
                <p className='ml-1 mt-1'>4.9.11. Post, upload or distribute any defamatory, slanderous or inaccurate user content or any other form of content.</p>
                <p className='ml-1 mt-1'>4.9.12. Post, upload or distribute any user content that is unlawful, offensive, pornographic, harassing, threatening, racist, hateful or otherwise inappropriate.</p>
                <p className='ml-1 mt-1'>4.9.13. Impersonate any person or entity, falsely state or otherwise misrepresent yourself and your age, or create a false identity on the Site, {CompanyName}’s Facebook page or any other service.</p>
                <p className='ml-1 mt-1'>4.9.14. Use or attempt to use another member’s account. Under no circumstances will this be permitted.</p>
                <p className='ml-1 mt-1'>4.9.14A.&nbsp; Log into the Site on more than one device at any given time.</p>
                <p className='ml-1 mt-1'>4.9.15. Delete, remove or obscure any copyright or other proprietary notices on the Site, Facebook or any other service.</p>
                <p className='ml-1 mt-1'>4.9.16. Upload, post, transmit or otherwise make available any unsolicited offers, advertisements, proposals or send junk mail or spam to other users of the Site. This includes, but is not limited to, unsolicited advertising, promotional materials, or other solicitation material, bulk mailing of commercial advertising, chain mail, informational announcements, charity requests, and petitions for signatures.</p>
                <p className='ml-1 mt-1'>4.9.17. Upload, post, transmit, share, store or otherwise make publicly available any private information of any third party, including addresses, phone number, email addresses, credit card numbers etc.</p>
                <p className='ml-1 mt-1'>4.9.18. Solicit personal information from anyone under 18 or solicit passwords or personal information for commercial or unlawful purposes.</p>
                <p className='ml-1 mt-1'>4.9.19. Upload, post, transmit, share or otherwise make available any material that contains software viruses or any other computer code, viruses, malware, bots, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment.</p>
                <p className='ml-1 mt-1'>4.9.20. Upload, post, transmit, share, store or otherwise make available content that would constitute, encourage or provide instructions for a criminal offence, violate the rights of any party, or that would otherwise create liability or violate any local, state, national or international law.</p>
                <p className='ml-1 mt-1'>4.9.21. Upload, post, transmit, share, store or otherwise make available content that, in the sole judgment of {CompanyName}, is objectionable or which restricts or inhibits any other person from using or enjoying the Site, or {CompanyName}’s Facebook page, or which may expose {CompanyName} or its users to any harm or liability of any type.</p>
                <ol start={5}>
                    <li><strong>MEMBERSHIP</strong></li>
                </ol>
                <p className='ml-1 mt-1'><strong>Registration</strong></p>
                <p className='ml-1 mt-1'>5.1. A certain percentage of the content on the Site is available for free viewing without requiring any form of membership.</p>
                <p className='ml-1 mt-1'>5.2. To access additional content you will be required to register as a member (“Member”) with the Site and to purchase a membership (“Membership”). {CompanyName} grants Members and Member-Organisations a licence to access certain content and features on/of the Site, depending on the precise terms of their Membership (see below).</p>
                <p className='ml-1 mt-1'>5.3. In order to register you will be required to provide certain information, including your full name and email address, and where applicable, we may require organisation name and details.</p>
                <p className='ml-1 mt-1'>5.4. The information you provide must be true, accurate, current and complete. If the original information provided upon initial sign-up changes after this time, it is your obligation to update and correct it. If any information provided by you is not true, accurate, current or complete, {CompanyName} maintains the right to terminate your Membership and refuse any current or future access or use of the Site.</p>
                <p className='ml-1 mt-1'>5.5. When selecting a password, for your own security you should choose a combination of lower case, uppercase, number and symbols (for example, Br1dGe$). Please ensure you select a password unique for your {CompanyName} account. Avoid choosing obvious words or dates such as a nickname or your birth date. Please exercise maximum caution to keep your username and password confidential and log-off from Site when your session is complete to prevent unauthorised access to your information. If your username or password is subject to unauthorised access, you should immediately inform {CompanyName}.</p>
                <p className='ml-1 mt-1'>5.6. Once {CompanyName} has received your information you will be sent a confirmation email confirming that you are a Member of the Site. You will have your own Member’s account, with an account management page, which will contain details of any Membership(s) that you have purchased and your account settings.</p>
                <p className='ml-1 mt-1'>5.7. For security purposes, each Member’s account can only be accessed on one device at a time. As explained in clause 5.15.2 below, we are able to monitor all Members’ usage of the Site and we do not permit Members to share their login details.&nbsp; If you have been logged out of your account, please check that you are not logged in on any other device and that you have not shared your login details with anyone else.</p>
                <p className='ml-1 mt-1'>5.7A. You can access the Site from a maximum of five devices within a 30-day period.&nbsp; If you exceed this number, your account may be terminated.</p>
                <p className='ml-1 mt-1'><strong>Charges and Payment</strong></p>
                <p className='ml-1 mt-1'>5.8. To access the Members’ section of {CompanyName}, a user must purchase Membership (“Subscription(s)”).</p>
                <p className='ml-1 mt-1'>5.9. {CompanyName} reserves the right to make any changes at any time to the amount, structure or timing of any charges and/or payments for any of the Services.</p>
                <p className='ml-1 mt-1'>5.10. You will be billed in advance on a recurring and periodic basis (except if your account is an independant student's account) (referred to as a “Billing Cycle”). Billing Cycles are set either on a monthly, three-monthly, annual or biennial basis, depending on the type of subscription plan you select when purchasing a Subscription.</p>
                <p className='ml-1 mt-1'>5.11. Where applicable, at the end of each Billing Cycle, your Subscription will automatically renew under the same conditions unless you cancel it or unless {CompanyName} cancels it. You may cancel your Subscription renewal either through your account management page or by contacting {CompanyName}’s customer support team.</p>
                <p className='ml-1 mt-1'>5.12. Where applicable, a valid payment method, including credit card or debit card, is required to process the payment for your Subscription. You shall provide {CompanyName} with accurate and complete billing information including your full name and details of a valid payment method. By submitting such payment information, you automatically authorise {CompanyName} to charge all Subscription fees incurred through your account to any such payment instruments.</p>
                <p className='ml-1 mt-1'><strong>Termination and suspension</strong></p>
                <p className='ml-1 mt-1'>5.15. {CompanyName} may terminate or suspend with immediate effect and without notice your access to and use of the Services as a Member, for any reason, and, in particular if we:</p>
                <p className='ml-1 mt-1'>5.15.1. do not receive payment;</p>
                <p className='ml-1 mt-1'>5.15.2. believe you have shared your account with another student, person or entity <strong>({CompanyName} is able to monitor your usage of the service and will use this information to draw a conclusion as to whether you have shared your account details);</strong></p>
                <p className='ml-1 mt-1'>5.15.2A. believe that you have logged into the Site on more than five devices within a given 30-day period;</p>
                <p className='ml-1 mt-1'>5.15.3. believe that you have breached any of the Terms of Service;</p>
                <p className='ml-1 mt-1'>5.15.4. are unable to verify the accuracy or validity of any information provided by you; or</p>
                <p className='ml-1 mt-1'>5.15.5. suspect fraudulent, abusive or illegal activity by you.</p>
                <p className='ml-1 mt-1'>5.16. {CompanyName} may come to a conclusion which will result in termination or suspension even if it is based upon our opinion or mere suspicion or belief, without any duty to prove that our opinion or suspicion is well-founded and even if our opinion or suspicion proves not to be well-founded.</p>
                <p className='ml-1 mt-1'>5.17. At any point, if {CompanyName} deems user conduct to be unsuitable, the Company may, of its own volition, choose to terminate any licence or permission previously granted to a user.</p>
                <p className='ml-1 mt-1'>5.18. You may cancel your Membership at any time but under no circumstances will {CompanyName} provide a refund of any payment(s) (see clause 12 below).</p>
                <ol start={6}>
                    <li><strong>THIRD PARTIES</strong></li>
                </ol>
                <p className='ml-1 mt-1'>6.1. {CompanyName} is not associated with and is not an agent of any third party, including any party named or linked on the Site, and therefore does not have any authority as regards such third parties.</p>
                <p className='ml-1 mt-1'>6.2. {CompanyName} maintains no jurisdiction over, endorsement, responsibility or liability for any content, products, advertising or other resources available from any third party.</p>
                <p className='ml-1 mt-1'>6.3. By agreeing to the Terms of Service, you agree that {CompanyName} (and our officers, directors and employees) have no liability to you in relation to any dispute you may have with any third party.</p>
                <p className='ml-1 mt-1'>6.4. {CompanyName} is a private company and acts solely and entirely independently from any exam board, including any exam board mentioned on the Site. {CompanyName} and the exam boards (whether or not mentioned on the Site) share no formal contract, affiliation, endorsement or association with each other. In no way do any of the exam boards manage, check or engage in any quality control in respect of any of the Services, including any the content available on the Site. As explained in clause 4 above, reliance on the Services, including any information appearing on the Site, is strictly at your own risk.</p>
                <ol start={7}>
                    <li><strong>COPYRIGHT</strong></li>
                </ol>
                <p className='ml-1 mt-1'>7.1. By agreeing to the Terms of Service, you acknowledge that all of the content and information provided on the Site and/or through the Services, or contained in any advertisements, sponsorships, or presented to you by {CompanyName}, is protected by relevant copyrights, trademarks, service marks, patents, or other proprietary rights and laws. This applies to all the content and information, including but not limited to text, software, music, sound, photographs, graphics, video or other material featured on the Site.</p>
                <p className='ml-1 mt-1'>7.2. Except as expressly authorised by {CompanyName}, you agree not to copy, reproduce, download, modify, translate, publish, broadcast, transmit, distribute, publish, edit, adapt, upload, share, display, license, sell or otherwise exploit for any purposes whatsoever any content featured on the Site.</p>
                <p className='ml-1 mt-1'>7.3. {CompanyName} reserves all relevant rights to the content on the Site not expressly granted in the Terms of Service.</p>
                <ol start={8}>
                    <li><strong>Limitation of Liabilities</strong></li>
                </ol>
                <p className='ml-1 mt-1'>8.1. To the fullest extent permitted by the applicable laws {CompanyName}, on its own behalf and on behalf of its parents, subsidiaries, affiliates, officers, directors, shareholders, employees and suppliers, exclude and disclaim liability for any losses and expenses of whatever nature and howsoever arising including, without limitation, any direct, indirect, special, incidental, consequential, punitive or exemplary damages, including but not limited to loss of business, profits, data, use, revenue or other economic advantage, claims of third parties, arising out of or in connection with the Services, or any linked services or websites, even if advised of the possibility of such damages. This limitation of liability applies whether the alleged liability is based on contract, tort (including negligence) strict liability or any other basis.</p>
                <p className='ml-1 mt-1'>8.2. The limitations set out in clause 8.1 above are fundamental to the bargain between us and you. The Services would not be provided without such limitations.</p>
                <p className='ml-1 mt-1'>8.3. {CompanyName}’s liability, and/or the liability of our parents, subsidiaries, officers, directors, employees, and suppliers, to you or any third parties, will not, in any circumstances, exceed the amount of any charges and/or payments that you make to {CompanyName} in the 12 months prior to the action or event giving rise to the liability.</p>
                <p className='ml-1 mt-1'>8.4. You and {CompanyName} agree that any cause of action arising out of or related to the Services must commence within 6 months after the cause of action arose (except for causes of action arising out of users’ responsibilities described in clause 10 below); otherwise, such cause of action is permanently barred.</p>
                <ol start={9}>
                    <li><strong>AMENDMENT OF THE TERMS OF SERVICE</strong></li>
                </ol>
                <p className='ml-1 mt-1'>9.1. {CompanyName} reserves the right, at our discretion, to change, modify, add or remove the whole or part of the Terms of Service at any time.</p>
                <p className='ml-1 mt-1'>9.2. In the event that the Terms of Service are altered, {CompanyName} will post the amended terms on the Site and changes will apply from the date of posting.</p>
                <p className='ml-1 mt-1'>9.3. If, after the Terms of Service and/or the Privacy Policy have been altered, you do not agree to their terms, you must stop using the Site.</p>
                <ol start={10}>
                    <li><strong>SITE MAINTENANCE AND ALTERATION</strong></li>
                </ol>
                <p className='ml-1 mt-1'>10.1. Whilst {CompanyName} will try to provide you with uninterrupted access to the Site and the Services, we may need to withdraw, modify, discontinue or temporarily or permanently suspend one or more aspects of the Site, e.g. if {CompanyName} is experiencing technical difficulties. However, {CompanyName} will try, wherever possible, to give reasonable notice of its intention to do so.</p>
                <p className='ml-1 mt-1'>10.2. {CompanyName} reserves the right to withhold, remove, alter, amend and/or discard any content on the Site, including content made available to you as a Member, for any reason with or without notice at any time.</p>
                <ol start={11}>
                    <li><strong>INDEMNITY</strong></li>
                </ol>
                <p className='ml-1 mt-1'>You agree to indemnify {CompanyName}, its subsidiaries, and affiliates, and their respective officers, agents, partners and employees, in relation to any loss, liability, claim, or demand, including reasonable legal fees, arising out of or in connection with your use of the Site and the Services in violation of the Terms of Service and/or arising from a breach of the Terms of Service and/or any breach of any representations and warranties that you make to the Company and/or if any content that you post on or through the Site causes {CompanyName}, its subsidiaries, and affiliates, and their respective officers, agents, partners and employees, to become liable to any other party.</p>
                <ol start={12}>
                    <li><strong>REFUNDS</strong></li>
                </ol>
                <p className='ml-1 mt-1'>We do not offer refunds on purchases made through the Site. We provide free samples of content before you purchase a Subscription or make a One-time payment in order to help inform your decision to purchase or not.</p>


                <ol start={12}>
                    <li>
                        <strong>Compliance with YouTube's Terms of Service</strong>
                    </li>
                </ol>
                <p className='ml-1 mt-1'>
                    By using our service, you acknowledge and agree that you are also bound by YouTube's Terms of Service. We require all users to review and comply with these terms when accessing YouTube content through our platform. <br />
                    YouTube's Terms of Service can be found at the following URL:
                    <a href='https://www.youtube.com/t/terms' className='text-blue-500 hover:cursor-pointer hover:underline ml-1'>https://www.youtube.com/t/terms</a>
                </p>
            </div>
        </div>
    )
}

export default TCPolicy
