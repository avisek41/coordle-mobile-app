import { ScrollView } from 'react-native';
import {
  Box,
  Card,
  Text,
  VStack,
  HStack,
  Input,
  InputField,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { useAppContext } from '@/src/Context';
import GradientButton from '@/src/components/GradientButton';

export default function LoginScreen() {
  const { setIsLoggedIn } = useAppContext();
  return (
    <Box className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <Box className="flex-1 justify-center items-center px-4">
          <Card className="w-full max-w-md p-6 rounded-2xl bg-white shadow-lg">
            <VStack className="space-y-5">
              <Text className="text-center text-xl text-gray-500 mb-10 mt-10 font-heading">
                Sign in to continue
              </Text>

              {/* Email */}
              <VStack className="space-y-1">
                <Text className="text-sm font-body text-black-600 mb-3">
                  Email or User name
                </Text>
                <Input
                  testID="EmailInput"
                  className="border border-gray-300 rounded-lg"
                >
                  <InputField
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    className="ml-2"
                  />
                </Input>
              </VStack>

              {/* Password */}
              <VStack className="space-y-1 mt-4">
                <Text className="text-sm font-heading text-gray-600 mb-3">
                  Password
                </Text>
                <Input
                  testID="PasswordInput"
                  className="border border-gray-300 rounded-lg"
                >
                  <InputField
                    className="ml-2"
                    placeholder="••••••••"
                    secureTextEntry
                  />
                </Input>
              </VStack>

              {/* Forgot Password */}
              <HStack className="justify-end mt-4">
                <Button className="p-0">
                  <ButtonText className="text-indigo-600 text-sm">
                    Forgot Password?
                  </ButtonText>
                </Button>
              </HStack>

              {/* Login Button */}
              <GradientButton
                title="Login"
                onPress={() => {
                  setIsLoggedIn(true);
                }}
              />
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </Box>
  );
}
