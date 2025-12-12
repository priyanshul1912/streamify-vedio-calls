import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAuthUsers from "../hooks/useAuthUsers"
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, ShipWheelIcon, ShuffleIcon, CameraIcon} from "lucide-react";
import { LANGUAGES } from "../constants";
import { MapPinIcon } from "lucide-react";



const OnboardingPage = () => {
  const {authUser} = useAuthUsers();
  const queryClient = useQueryClient();

  const [formState,setFormState]= useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLangauge: authUser?.nativeLangauge || "",
    location: authUser?.location || "",
    learningLangauge: authUser?.learningLangauge || "",
    profilePic: authUser?.profilePic || "",
  });

  const {mutate:onbaordingMutation,isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess : () =>{
      toast.success("Profile onbarded successfully");
      queryClient.invalidateQueries({queryKey: ["authUser"]})
    },
    onError: (error) =>{
      toast.error(error.response.data.message);
    }
  })

  const handleSubmit = (e) =>{
    e.preventDefault();

    onbaordingMutation(formState);
  };

  const handleRandomAvatar = () =>{
      const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");

  }
  return (
  <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
    <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
      <div className="card-body p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Complete your Profile
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PROFILE PIC CONTAINER */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* IMAGE PREVIEW */}
            <div className="size-32 rounded-full bg-base-300 overflow-hidden">
              {formState.profilePic ? (
                <img
                  src={formState.profilePic}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <CameraIcon className="size-12 text-base-content opacity-40" />
                </div>
              )}
            </div>
            
            {/* Generate Random Avatar BTN */}
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={handleRandomAvatar} 
                className="btn btn-accent"
              >
                <ShuffleIcon className="size-4 mr-2" />
                Generate Random Avatar
              </button>
            </div>
          </div>
               {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>
             {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label" >
                  <span className="label-text">Native Language</span>
                </label>
                 <select
                  name="nativeLanguage"
                  value={formState.nativeLangauge}
                  onChange={(e) => setFormState({ ...formState, nativeLangauge: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
               {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLangauge"
                  value={formState.learningLangauge}
                  onChange={(e) => setFormState({ ...formState, learningLangauge: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

              {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/*SUBMIT BUTTON */}

            <button className=" btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                <ShipWheelIcon className="size-5 mr-2" />
                Complete Onboarding
                </>
              ) : (
                 <>
                <LoaderIcon className=" animate-spin size-5 mr-2" />
               Onbaording...
                </>
              )}
            </button>

        </form>
      </div>
    </div>
  </div>
);

}

export default OnboardingPage