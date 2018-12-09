using UnityEditor;

[CustomEditor(typeof(bl_KillCam))]
public class bl_KillCamEditor : Editor
{

    public override void OnInspectorGUI()
    {
       bl_KillCam script = (bl_KillCam)target;
        bool allowSceneObjects = !EditorUtility.IsPersistent(script);
        EditorGUILayout.BeginVertical("window");
        EditorGUILayout.BeginVertical("Box");
        EditorGUILayout.LabelField("", "UI Style", "Button");
        script.UI.Skin = EditorGUILayout.ObjectField("GUI Skin", script.UI.Skin, typeof(UnityEngine.GUISkin), allowSceneObjects) as UnityEngine.GUISkin;
        script.UI.KillCamEffect = EditorGUILayout.ObjectField("Kill Cam Effect ", script.UI.KillCamEffect, typeof(UnityEngine.Texture2D), allowSceneObjects) as UnityEngine.Texture2D;
        script.UI.InfoBackGround = EditorGUILayout.ObjectField("Info Effect ", script.UI.InfoBackGround, typeof(UnityEngine.Texture2D), allowSceneObjects) as UnityEngine.Texture2D;
        script.UI.UIColor = EditorGUILayout.ColorField("UI Color ", script.UI.UIColor);
        script.KillCamTitle = EditorGUILayout.TextField("Kill Cam Title", script.KillCamTitle);
        EditorGUILayout.EndVertical();
        EditorGUILayout.BeginVertical("Box");
        EditorGUILayout.LabelField("", "Targets", "Button");
        script.TagTargets = EditorGUILayout.TagField("Enemy",script.TagTargets);
        script.Provide = EditorGUILayout.ObjectField("Provide", script.Provide, typeof(UnityEngine.Transform), allowSceneObjects) as UnityEngine.Transform;
        script.m_wait = EditorGUILayout.IntField("Wait for Controll", script.m_wait);
        EditorGUILayout.Space();
        script.distanceMax = EditorGUILayout.FloatField("Max Distance", script.distanceMax);
        script.distanceMin = EditorGUILayout.FloatField("Min Distance", script.distanceMin);
        EditorGUILayout.Space();
         script.xSpeed = EditorGUILayout.FloatField("X Speed", script.xSpeed);
         script.ySpeed = EditorGUILayout.FloatField("Y Speed", script.ySpeed);
         EditorGUILayout.Space();
         script.yMaxLimit = EditorGUILayout.FloatField("Max Y Limit", script.yMaxLimit);
         script.yMinLimit = EditorGUILayout.FloatField("Min Y Litmit", script.yMinLimit);
         if (script.SmoothMovement)
         {
             script.SpeedSmooth = EditorGUILayout.FloatField("Smooth Speed", script.SpeedSmooth);
         }
         EditorGUILayout.Space();
        EditorGUILayout.EndVertical();
        EditorGUILayout.BeginVertical("Box");
        EditorGUILayout.LabelField("", "Bools", "Button");
        script.SmoothMovement = EditorGUILayout.Toggle("Smooth Movement", script.SmoothMovement);
        script.Can_See_Other = EditorGUILayout.Toggle("Can see others", script.Can_See_Other);
        EditorGUILayout.EndVertical();
        EditorGUILayout.EndVertical();
    }

}
