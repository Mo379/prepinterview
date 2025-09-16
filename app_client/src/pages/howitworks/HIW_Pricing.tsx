import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useServiceStore } from "@/stores/serviceStore";
import { useUserStore } from "@/stores/userStore";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

enum PopularPlanType {
    NO = 0,
    YES = 1,
}

interface PricingProps {
    title: string;
    popular: PopularPlanType;
    price: number;
    description: string;
    buttonText: string;
    benefitList: string[];
}

const pricingList: PricingProps[] = [
    {
        title: "Free",
        popular: 0,
        price: 0,
        description:
            "You need an account.",
        buttonText: "Signup free",
        benefitList: [
            "Access basic features.",
            "Limited usage.",
        ],
    },
    //{
    //    title: "Pro",
    //    popular: 0,
    //    price: 20,
    //    description:
    //        "Get access to all Pro features.",
    //    buttonText: "Get Pro",
    //    benefitList: [
    //        "Create and manage your own course.",
    //        "Best Models.",
    //        "Unlimited access.",
    //    ],
    //},
];


const manageMembership: any = [
    {
        title: "Manage Your membership",
        popular: 0,
        description:
            "For Managing your premium PrepInterview Membership.",
        buttonText: "Manage Membership",
        benefitList: [
            "Change Billing Method",
            "Change Membership",
            "Cancel Membership",
        ],
    },
];

export const HIW_Pricing = () => {
    const { serviceCreateCheckoutSession, serviceCreatePortalSession, serviceLoading } = useServiceStore(
        useShallow((state) => ({
            serviceCreateCheckoutSession: state.serviceCreateCheckoutSession,
            serviceCreatePortalSession: state.serviceCreatePortalSession,
            serviceLoading: state.loading,
        })),
    )
    const { auth } = useUserStore(
        useShallow((state) => ({
            auth: state.auth,
        })),
    )
    const { setError } = useForm<any>()
    const navigate = useNavigate()
    return (
        <section
            id="pricing"
            className="py-8"
        >
            {auth.is_member ? (
                <>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        Manage Your
                        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                            {" "}
                        </span>
                        Membership
                    </h2>
                    <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
                        You can change or cancel your memberships using this management portal.
                    </h3>
                    <div className="grid w-[50%] m-auto text-center gap-8">
                        {
                            manageMembership.map((pricing: PricingProps) => (
                                <Card
                                    key={pricing.title}
                                    className={
                                        pricing.popular === PopularPlanType.YES
                                            ? "shadow-black/10 dark:shadow-white/10 text-center"
                                            : ""
                                    }
                                >
                                    <CardHeader>
                                        <CardTitle className="flex item-center justify-center text-center">
                                            {pricing.title}
                                            {pricing.popular === PopularPlanType.YES ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-sm text-primary"
                                                >
                                                    Most popular
                                                </Badge>
                                            ) : null}
                                        </CardTitle>

                                        <CardDescription>{pricing.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {serviceLoading.serviceCreatePortalSession ? (
                                            <Button
                                                className="w-full"
                                                variant={'ghost'}
                                            >
                                                <Loader2 className="animate-spin" />
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full"
                                                onClick={() => {
                                                    serviceCreatePortalSession(setError)
                                                }}
                                            >{pricing.buttonText}</Button>
                                        )}
                                    </CardContent>

                                    <hr className="w-4/5 m-auto mb-4" />

                                    <CardFooter className="flex">
                                        <div className="space-y-4">
                                            {pricing.benefitList.map((benefit: string) => (
                                                <span
                                                    key={benefit}
                                                    className="flex"
                                                >
                                                    <Check className="text-green-500" />{" "}
                                                    <h3 className="ml-2">{benefit}</h3>
                                                </span>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))
                        }
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                        Get
                        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                            {" "}
                            Pro{" "}
                        </span>
                        Access
                    </h2>
                    <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
                        A Pro Membership gives you more everything
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {
                            pricingList.map((pricing: PricingProps) => (
                                <Card
                                    key={pricing.title}
                                    className={
                                        pricing.popular === PopularPlanType.YES
                                            ? "shadow-black/10 dark:shadow-white/10"
                                            : ""
                                    }
                                >
                                    <CardHeader>
                                        <CardTitle className="flex item-center justify-between">
                                            {pricing.title}
                                            {pricing.popular === PopularPlanType.YES ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-sm text-primary"
                                                >
                                                    Most popular
                                                </Badge>
                                            ) : null}
                                        </CardTitle>
                                        {pricing.price ? (
                                            <div>
                                                <span className="text-3xl font-bold">£{pricing.price}</span>
                                                <span className="text-muted-foreground"> /month</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="text-3xl font-bold">Free</span>
                                                <span className="text-muted-foreground"></span>
                                            </div>
                                        )}

                                        <CardDescription>{pricing.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        {serviceLoading.serviceCreateCheckoutSession ? (
                                            <Button
                                                className="w-full"
                                                variant={'ghost'}
                                            >
                                                <Loader2 className="animate-spin" />
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full"
                                                onClick={() => {
                                                    if (auth.hid) {
                                                        if (pricing.title === 'Free') {
                                                            navigate('/')
                                                        } else if (pricing.title === 'Pro') {
                                                            serviceCreateCheckoutSession(setError, 1)
                                                        }
                                                        } else {
                                                        navigate('/auth')
                                                    }
                                                }}
                                            >{pricing.buttonText}</Button>
                                        )}
                                    </CardContent>

                                    <hr className="w-4/5 m-auto mb-4" />

                                    <CardFooter className="flex">
                                        <div className="space-y-4">
                                            {pricing.benefitList.map((benefit: string) => (
                                                <span
                                                    key={benefit}
                                                    className="flex"
                                                >
                                                    <Check className="text-green-500" />{" "}
                                                    <h3 className="ml-2">{benefit}</h3>
                                                </span>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))
                        }
                    </div>
                </>
            )}
        </section>
    );
};
